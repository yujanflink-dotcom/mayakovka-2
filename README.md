# IA Dashboard

Dashboard personal de noticias y videos sobre Inteligencia Artificial, alimentado desde los feeds RSS publicos de YouTube.

## Requisitos

- Node.js 18+

## Configuracion local

```bash
cd ai-video-dashboard

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Edita .env con tu CRON_SECRET (opcional para local)

# Inicializar la base de datos (SQLite)
npx prisma db push

# Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

**Nota:** La primera vez la base de datos estara vacia. Anade canales en `src/lib/config.ts` y haz clic en "Actualizar ahora".

## Como anadir canales de YouTube

Edita `src/lib/config.ts`. Cada categoria tiene un array `channels` donde debes poner IDs de canales:

```ts
channels: [
  'UCX6b17PVsYBQ0ip5gyeme-Q', // Ejemplo: DotCSV
  'UC...',                      // Otro canal
],
```

El contenido se obtiene via RSS publico: `https://www.youtube.com/feeds/videos.xml?channel_id={ID}`

### Como encontrar el ID de un canal:

1. Ve al canal en YouTube
2. La URL suele ser `https://www.youtube.com/@nombre` o `https://www.youtube.com/channel/UC...`
3. Si ves `@nombre`, usa un conversor online como `https://commentpicker.com/youtube-channel-id.php`
4. O usa el canal `UC...` directamente si aparece en la URL

## Uso

1. **Primera carga:** Anade canales en la config, haz clic en "Actualizar ahora".
2. **Navegacion:** Pestañas para filtrar por categoria. Busqueda en todos los videos.
3. **Favoritos:** Pasa el raton sobre una tarjeta y haz clic en el corazon.
4. **Ver video:** Haz clic en cualquier tarjeta para abrir el video en YouTube.

## Despliegue en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Conecta tu repositorio de GitHub
2. Anade las variables de entorno en Vercel:
   - `TURSO_DATABASE_URL` - URL de tu base de datos Turso (libsql://...)
   - `TURSO_AUTH_TOKEN` - Token de autenticacion de Turso
   - `CRON_SECRET` - String aleatorio para proteger el endpoint de refresh
3. Despliega

### Base de datos para produccion (Turso)

SQLite no persiste datos en Vercel (serverless). Usamos **Turso**, una base de datos SQLite serverless gratuita.

#### Crear base de datos en Turso

1. Crea una cuenta gratis en [turso.tech](https://turso.tech) (con GitHub basta)
2. Instala la CLI de Turso:
   ```bash
   npm install -g turso
   # o en macOS: brew install tursodatabase/tap/turso
   ```
3. Inicia sesion:
   ```bash
   turso auth login
   ```
4. Crea la base de datos:
   ```bash
   turso db create ia-dashboard
   ```
5. Obtén la URL de conexion (libSQL):
   ```bash
   turso db show ia-dashboard --url
   # Copia la URL (empieza por libsql://...)
   ```
6. Genera un token de autenticacion:
   ```bash
   turso db tokens create ia-dashboard
   # Copia el token generado
   ```

Luego pega esos dos valores en las variables de entorno de Vercel: `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.

#### Migraciones (schema)

Cuando cambies el schema de Prisma, ejecuta localmente contra SQLite y luego replica los cambios a Turso:

```bash
# 1. Aplica cambios localmente
npx prisma db push

# 2. Replica el schema a Turso (necesitas turso CLI instalado)
turso db shell ia-dashboard < prisma/schema.prisma
# O, alternativamente, usa el comando:
npx prisma db push --accept-data-loss
# con DATABASE_URL apuntando a la URL de Turso
```

## Actualizacion automatica (Cron)

### GitHub Actions (recomendada, gratuita)

1. Sube el proyecto a GitHub
2. Ve a `Settings > Secrets and variables > Actions`
3. Anade:
   - `CRON_SECRET` - el mismo que en `.env`
   - `APP_URL` - URL de tu app desplegada (ej: `https://tu-app.vercel.app`)
4. El workflow se ejecuta cada 6h automaticamente

### Vercel Cron Jobs (Pro)

```json
{
  "crons": [
    { "path": "/api/refresh", "schedule": "0 */6 * * *" }
  ]
}
```

## Estructura

```
src/
  app/
    api/
      videos/route.ts    # GET: devuelve videos desde la BD
      refresh/route.ts   # GET/POST: refresca desde RSS
    globals.css
    layout.tsx
    page.tsx
  components/
    Header.tsx
    CategoryTabs.tsx
    VideoCard.tsx
    ThemeProvider.tsx
    ThemeToggle.tsx
  lib/
    config.ts            # Categorias y canales (editar aqui)
    prisma.ts            # Cliente Prisma
    youtube.ts           # Parser de feeds RSS de YouTube
  types/
    index.ts
prisma/
  schema.prisma
```
