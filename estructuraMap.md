# Aplicación de Quiz con Next.js y Prisma

## Autenticación
- NextAuth
  - Proveedores
    - Google
  - Sesiones
    - JWT
  - Callbacks
    - jwt
    - session

## Base de Datos
- Prisma
  - Modelos
    - Usuario
    - Juego
    - Pregunta
  - Operaciones
    - findUnique
    - create
    - update
    - upsert

## Funcionalidades
- Creación de Quiz
  - Formulario
    - React Hook Form
    - Zod para validación
  - Tipos de Preguntas
    - Opción Múltiple (MCQ)
    - Abiertas
- Juego
  - Iniciar
  - Responder Preguntas
    - Verificación de Respuestas
      - MCQ: Comparación directa
      - Abiertas: Similitud de cadenas
  - Finalizar
- Estadísticas
  - Precisión
  - Tiempo tomado
  - Lista de Preguntas

## Componentes
- UI
  - Botones
  - Formularios
  - Tarjetas
- Funcionales
  - MCQ
  - OpenEnded
  - Historial
  - Detalles del Juego

## Librerías y Herramientas
- React
- Next.js
- Tailwind CSS
- Axios
- React Query
- Lucide React para iconos
- OpenAI para generación de preguntas

## Integraciones
- OpenAI
  - Generación de preguntas
- Google Auth
  - Autenticación de usuarios

## Temas y Personalización
- Tema Oscuro/Claro
- Personalización de temas con Next Themes

## Navegación
- Rutas
  - Dashboard
  - Quiz
  - Play
  - Statistics
