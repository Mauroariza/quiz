// jsonFormatter.js

// Cadena de JSON malformado
const malformedJsonString = `
[
  {"question": "In present simple, the third person singular ends in what sound?", "answer": "-s/-es sound", "option1": "-ed sound", "option2": "-ing sound", "option3": "no sound"},
  {"question": "What is the base form of verb in present simple tense?", "answer": "Infinitive without "to"", "option1": "Past participle", "option2": "Present participle", "option3": "Infinitive with "to""},
  {"question": "Which adverb often used with present simple tense?", "answer": "Always", "option1": "Yesterday", "option2": "Tomorrow", "option3": "Later"},
  {"question": "Which auxiliary do we use usually use in Present Simple negative?", "answer": "Do not/Does not", "option1": "Am not/Is not", "option2": "Have not/Has not", "option3": "Will not"},
  {"question": "Which tense is "I watch TV every night"?", "answer": "Present Simple tense", "option1": "Present Continuous tense", "option2": "Past Simple tense", "option3": "Future Simple tense"},
  {"question": "In what person present simple tense uses "do" for questions?", "answer": "First and Second person", "option1": "Third person", "option2": "First person only", "option3": "Second person"},
  {"question": "How often does he visit his parents? is an example of what tense?", "answer": "Present Simple tense", "option1": "Past Simple tense", "option2": "Future Simple tense", "option3": "Present Continuous tense"},
  {"question": "In the sentence "She cooks dinner", what is the tense?", "answer": "Present Simple tense", "option1": "Present Continuous tense", "option2": "Past Simple tense", "option3": "Future Simple tense"},
  {"question": "Which form of verb does Simple Present use?", "answer": "Base form", "option1": "Past form", "option2": "-ing form", "option3": "-ed form"},
  {"question": "In "I live in Paris", the verb is in which tense?", "answer": "Present Simple tense", "option1": "Past Simple tense", "option2": "Future Simple tense", "option3": "Past Continuous tense"}
]
`;

// Función para escapar las comillas dobles dentro de los valores del JSON
function escapeDoubleQuotes(jsonString) {
  // Escapa todas las comillas dobles que no estén ya escapadas
  const escapedString = jsonString.replace(/(?<!\\)"/g, '\\"');

  try {
    // Intenta parsear el JSON escapado
    const json = JSON.parse(escapedString);
    console.log("JSON reparado correctamente:");
    console.log(JSON.stringify(json, null, 2));
  } catch (error) {
    console.error("Error al parsear el JSON escapado:", error.message);
    console.log("JSON escapado con problemas:");
    console.log(escapedString);
  }
}
