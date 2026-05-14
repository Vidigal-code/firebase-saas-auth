# Funcionalidades

## Autenticación

- **Login** con email y contraseña vía Firebase Auth
- **Registro** con validación de contraseña fuerte (mín. 8 caracteres, mayúscula, minúscula, número, especial)
- **Cambio de contraseña** vía diálogo en el dashboard
- **Guardias de ruta**: `PrivateRoute` bloquea acceso no autenticado, `GuestRoute` redirige usuarios conectados fuera de las páginas públicas

## Gestión de Conexiones

- **Crear** conexiones nombradas (espacios de trabajo aislados)
- **Editar** nombre de la conexión
- **Eliminar** con diálogo de confirmación
- Cada conexión es un silo multi-tenant — los usuarios solo ven sus propios datos

## Gestión de Contactos

- **Agregar contactos** con nombre y teléfono por conexión
- **Editar** y **eliminar** contactos
- Listado paginado con listeners en tiempo real de Firestore

## Mensajes y Envíos Masivos

- **Enviar mensajes** a múltiples contactos simultáneamente
- **Programar mensajes** para envío futuro
- **Pestañas**: Todos, Enviados, Programados
- Seguimiento de estado en tiempo real por mensaje

## Internacionalización (i18n)

- **3 idiomas**: Portugués (PT), Inglés (EN), Español (ES)
- Sistema de traducción basado en JSON en `src/shared/langs/`
- `LangProvider` con sincronización por parámetro de URL (`?lang=pt`)
- Persistencia en `localStorage` con fallback a `VITE_START_LANG`
- Componente `LangSelector` para cambio en tiempo de ejecución

## Temas

- Soporte para modo **Oscuro** y **Claro**
- Componente `ThemeToggleButton`
- Persistencia vía `localStorage` con fallback a `VITE_START_THEME`
- Sincronización por parámetro de URL (`?theme=dark`)

## Seguridad

- **Firestore Rules** imponen aislamiento multi-tenant vía validación de `clientId`
- Cada usuario solo puede leer/escribir sus propias conexiones, contactos y mensajes
- Política de contraseña fuerte aplicada en el registro

## Componentes Reutilizables

| Componente | Propósito |
|---|---|
| `LangSelector` | Dropdown de selección de idioma |
| `ThemeToggleButton` | Toggle modo oscuro/claro |
| `LangThemeBar` | Layout grid combinado lang + tema |
| `ActionButtonGroup` | Grid de botones configurable |
| `ConfirmDialog` | Confirmación de eliminación reutilizable |
| `PageHeader` | Encabezado estandarizado con ícono y subtítulo |
| `BrandLogo` | Logo del app con tamaños configurables |
