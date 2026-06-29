# IA Dashboard — Progress

## Qué hace
Dashboard personal de IA con vídeos de YouTube por RSS, noticias de texto por RSS, y resúmenes de vídeo con IA.

## Arquitectura
- Next.js 14 (App Router) sin base de datos — caché vía `fetch` + `next.revalidate`
- Desplegado en Vercel
- Repo: `yujanflink-dotcom/mayakovka-2` (GitHub)

## Variables de entorno
- `GOOGLE_API_KEY` — clave de Gemini para resúmenes de vídeo
- `CRON_SECRET` — para autenticar endpoints de cron

## Estado actual de `src/app/api/summarize/route.ts`
- Usa `@google/generative-ai` con modelo `gemini-2.0-flash`
- Pasa `fileData` (`fileUri` + `mimeType: "video/*"`) más un `text` con el prompt como array plano de Parts a `generateContent()`
- Ya no usa transcripción (`youtube-transcript` eliminado), Gemini analiza el vídeo directamente
- Sintaxis del SDK corregida a camelCase y array plano de Parts
- **Sigue fallando** con error desconocido (probablemente `400 Bad Request` o `INVALID_ARGUMENT`)

## Siguiente paso
Obtener el mensaje de error **completo y exacto** que devuelve la API de Gemini (campo `detail` en la respuesta del endpoint, o `console.error` del servidor) para diagnosticar la causa real.
