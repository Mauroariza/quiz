import { Configuration, OpenAIApi } from "openai";
import { jsonrepair } from "jsonrepair";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-4",
  temperature: number = 1,
  num_tries: number = 1,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));
  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
    )}. \n
    Double quotes within the strings must be escaped with a backslash. Do not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    }

    const response = await openai.createChatCompletion({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format_prompt + error_msg,
        },
        { role: "user", content: user_prompt.toString() },
      ],
    });

    let res: string =
      response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

    res = res.replace(/(\w)"(\w)/g, "$1'$2");

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

    // Imprimir el JSON recibido en la consola
    console.log("JSON recibido:", res);

    // Crear manualmente el JSON
    let manualJson: any;
    try {
      manualJson = JSON.parse(res);
    } catch (parseError) {
      console.error("Error al parsear el JSON:", parseError);
      error_msg = `\n\nResult: ${res}\n\nError message: ${(parseError as Error).message}`;
      continue;
    }

    // Reparar el JSON malformado
    try {
      manualJson = jsonrepair(JSON.stringify(manualJson));
    } catch (repairError) {
      if (repairError instanceof Error) {
        console.error("Error al reparar el JSON:", repairError.message);
        error_msg = `\n\nResult: ${res}\n\nError message: ${repairError.message}`;
      } else {
        console.error("Error desconocido al reparar el JSON:", repairError);
        error_msg = `\n\nResult: ${res}\n\nError message: Error desconocido`;
      }
      continue;
    }

    // Imprimir el JSON reparado en la consola
    console.log("JSON reparado:", manualJson);

    // Intentamos parsear el JSON reparado
    try {
      let output: any = JSON.parse(manualJson);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in a list of json");
        }
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      if (e instanceof Error) {
        error_msg = `\n\nResult: ${res}\n\nError message: ${e.message}`;
      } else {
        error_msg = `\n\nResult: ${res}\n\nError message: Error desconocido`;
      }
      console.log("Ocurrió una excepción:", e);
      console.log("JSON inválido actual:", res);
    }
  }

  return [];
}