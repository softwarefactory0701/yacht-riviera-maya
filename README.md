# Yacht Riviera Maya — Concierge OS

Demo comercial independiente para gestionar leads, cotizaciones, catálogo de terceros, proveedores, reservas y operaciones concierge.

## Development

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Para probar localmente el resultado de producción:

```bash
npm run build
npm run start
```

## Deployment

El repositorio puede importarse directamente como un proyecto independiente en Vercel. El framework es Next.js y no requiere ajustes especiales de build.

- Build command: `npm run build`
- Output: detectado automáticamente por Vercel
- Install command: `npm install`

## Variables de entorno

Esta versión utiliza datos mock locales y no requiere variables de entorno obligatorias. No incluye Supabase, autenticación, pagos, WhatsApp ni correo reales.

## Acceso de demostración

La pantalla de acceso y la sesión visible son únicamente una simulación de interfaz para presentaciones comerciales. La marca `yrm-demo-session` se guarda temporalmente en `sessionStorage`; no protege información real ni sustituye autenticación. La autenticación de producción se implementará posteriormente con un proveedor seguro como Supabase Auth.

## Recursos

Las imágenes críticas de la demo viven en `public/demo/` para evitar dependencias de red durante presentaciones. Las instrucciones para incorporar el logotipo oficial están en `public/brand/README.md`.
