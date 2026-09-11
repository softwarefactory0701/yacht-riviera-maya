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

## Solicitudes públicas de demostración

El flujo público de disponibilidad guarda temporalmente la última solicitud en
`sessionStorage` bajo `yrm-public-request`. No envía información ni conecta
WhatsApp, email, Supabase o APIs externas.

La futura integración debe mapear la solicitud pública a un lead con:

- `source`: sitio público de Yacht RM
- `destinationId`: destino seleccionado
- `serviceSlug`, `service` y `category`: experiencia consultada
- `duration`, `guests`, `extras`, `date` y `preferredTime`: detalle del viaje
- `contact`: datos del cliente, consentimiento y método preferido

El flujo de producción previsto es: solicitud pública → lead → asignación por
destino → seguimiento concierge → cotización → reserva → operación.

### Dining y planificación de viajes

Las solicitudes Dining se guardan como `yrm-dining-request` y deben convertirse
en un lead con destino, categoría `dining`, experiencia o mesa solicitada,
fecha, hora, cantidad de personas y contacto. Cualquier comisión o referral
dependerá de un acuerdo real y confirmado con cada establecimiento.

Plan Your Stay guarda `yrm-trip-request`. El futuro modelo `Trip` contempla:
cliente, destino, fechas, personas, alojamiento, intereses, estilo, presupuesto,
ejecutivo asignado y estado. Sus estados previstos son `New`, `Designing`,
`Proposal Sent`, `Confirmed`, `In Stay` y `Completed`.

Flujo previsto: Plan Your Stay → Lead → Trip → ejecutivo → Quote → Services →
Booking → Operation. En esta fase todo continúa siendo una simulación local sin
backend, disponibilidad real ni envío de información.

## Contexto operativo multi-destino

El OS privado utiliza un único contexto frontend para `Global`, `Riviera Maya`,
`Miami` y `Los Cabos`. La selección se conserva durante la navegación en
`sessionStorage` bajo `yrm-active-destination` y vuelve a Global al cerrar
sesión. Destino representa dónde ocurre el servicio; no equivale a una oficina
física ni limita el equipo que puede atenderlo.

Los helpers de `lib/destination-context.tsx` centralizan el filtrado de
operaciones, leads, reservas, catálogo, proveedores y talento. Clientes se
mantiene global deliberadamente para conservar un solo historial comercial por
persona. Esta simulación no implementa permisos, sucursales reales ni RBAC.

## Recursos

Las imágenes críticas de la demo viven en `public/demo/` para evitar dependencias de red durante presentaciones. Las instrucciones para incorporar el logotipo oficial están en `public/brand/README.md`.
