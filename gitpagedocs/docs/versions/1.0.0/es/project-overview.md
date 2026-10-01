# Visión general del proyecto

## Estructura del repositorio

```
firebase-saas-auth/
├── functions/              # Cloud Functions (programación y limpieza en cascada)
├── web/                    # Frontend React + Vite
├── tests/                  # Pruebas de las reglas de Firestore (emulador)
├── scripts/                # Utilidades (ejecución de pruebas con emuladores)
├── firestore.rules         # Aislamiento multi-tenant y validación de datos
├── firestore.indexes.json  # Índices compuestos de las consultas
├── firebase.json           # Hosting, Functions, Firestore y emuladores
└── .github/workflows/      # CI/CD (pruebas + deploy automático)
```

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19, Material UI 9 (componentes), Tailwind CSS 4 (estilos) |
| Build | Vite 8 |
| Enrutamiento | React Router 7 |
| Formularios | React Hook Form + Zod |
| Backend | Firebase Authentication, Cloud Firestore, Cloud Functions v2 (Node 22) |
| Pruebas | Vitest, Testing Library, `@firebase/rules-unit-testing`, emuladores de Firebase |
| Calidad | ESLint (typescript-eslint strict), SonarQube |

## Principios

- **Paradigma funcional**: ninguna clase; componentes, hooks y funciones puras.
- **Fuente única de verdad**: nombres de colecciones, límites de validación, rutas y tokens de tema están en constantes; los colores se definen una vez en el tema de MUI y se exponen a Tailwind mediante variables CSS.
- **Seguridad en el servidor**: el aislamiento entre clientes lo garantizan las reglas de Firestore, no solo la interfaz.
- **Tiempo real**: listas sincronizadas con `onSnapshot`.
- **TDD**: reglas, Functions y dominio del frontend cubiertos por pruebas automatizadas.
