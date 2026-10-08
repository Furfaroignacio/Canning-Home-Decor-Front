# Canning Home Decor — Frontend

Cliente React del TPO de Aplicaciones Interactivas. Consume la API de Spring
Boot que vive en el repositorio del backend.

## Cómo levantarlo

Necesitás Node 18 o superior.

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`.

**El backend tiene que estar corriendo** en `http://localhost:4002`, con los
cambios de CORS y el endpoint `/api/v1/auth/me` aplicados. Si no, el login no
va a funcionar.

Si alguien levanta la API en otro puerto, se cambia en el archivo `.env`:

```
VITE_API_URL=http://localhost:4002
```

Vite solo expone al navegador las variables que empiezan con `VITE_`, y las lee
al arrancar: si cambiás el `.env` hay que frenar y volver a correr `npm run dev`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve lo compilado, para probar antes de entregar |
| `npm run lint` | Revisa el código con ESLint |

## Estructura

```
src/
├── api/          Todo lo que habla con el backend
│   ├── client.js     fetch con token, manejo de errores
│   ├── auth.js       registro, login, perfil
│   ├── products.js   catálogo y ABM de productos
│   ├── categories.js categorías
│   ├── cart.js       carrito y checkout
│   ├── orders.js     historial de compras
│   └── users.js      administración de cuentas
├── context/      Estado compartido por toda la app
│   ├── AuthContext.js   el contexto y el hook useAuth
│   └── AuthProvider.jsx el componente que lo provee
├── components/   Piezas reutilizables (Header, Layout, rutas protegidas)
├── views/        Una pantalla por archivo
└── styles/       Estilos globales y tokens de diseño
```

## Reglas del proyecto

**Ningún componente llama a `fetch` directamente.** Todo pasa por `src/api/`.
El token se agrega en un solo lugar, los errores llegan siempre con la misma
forma y no hay lógica de red repetida en cada pantalla.

**Después de un POST, PUT o DELETE no se vuelve a hacer un GET.** Casi todos
los endpoints devuelven el recurso ya actualizado: se usa esa respuesta para
actualizar el estado. La excepción es `DELETE /products/{id}`, que devuelve 204
sin cuerpo; ahí se saca el elemento del array local filtrando por id.

**Los efectos tienen array de dependencias.** Un `useEffect` sin array corre en
cada render. Si adentro hay un `setState`, entra en bucle infinito.

**Lo que se puede calcular no se guarda en el estado.** `esAdmin` sale de
`user.role`, no de un `useState` sincronizado con un efecto.

## Quién ve qué

El catálogo es **público**: cualquiera entra y mira los productos sin
registrarse. El login se pide recién para comprar o para administrar.

| Pantalla | Visitante | Comprador | Administrador |
|---|---|---|---|
| Catálogo y detalle | sí | sí | sí |
| Carrito y compra | no | sí | no |
| Mis compras | no | sí | no |
| Panel de administración | no | no | sí |

En el código eso lo resuelven dos componentes: `ProtectedRoute` exige sesión
(y opcionalmente un rol), y `SoloVisitantes` evita que alguien ya logueado
vuelva a ver el login.

## Estado actual

Listo: estructura, capa de API completa, sesión con JWT, rutas públicas y
protegidas, login y registro.

Pendiente: catálogo, detalle de producto, carrito, checkout, historial de
compras y el panel de administración. Los lugares donde van las rutas están
marcados con un comentario en `src/App.jsx`.
