# Workshop Canodrom — TODO Tracker

> Meeting: **13 May 2026, 10am @ Akaisha** — dashboard must be ready.
> Workshop date: TBD

Legend: ✅ Done · 🔄 In progress · ⬜ Pending · 🔥 Blocking

---

## 1. Project Setup

- ✅ Fork created (`canodrom-civic-ai`)
- ✅ Branding updated → Workshop Canodrom
- ✅ Tally form URL updated → `tally.so/r/9qpyWG`
- ✅ Vite base path → `/canodrom-civic-ai/`
- ✅ Pushed to GitHub (`espaifacto-code/canodrom-civic-ai`)
- ⬜ Enable GitHub Pages in repo settings (Settings → Pages → GitHub Actions)

---

## 2. Supabase — Canodrom Project

- ✅ New Supabase project created (`efvbridamwouyvakfnai`)
- ✅ `form_responses` table created with RLS policies
- ✅ `.env` credentials updated (URL + publishable key)
- ✅ 8 seed records inserted for testing
- ✅ Edge Function `tally-webhook` deployed (--no-verify-jwt)
- ✅ Tally webhook configured → `https://efvbridamwouyvakfnai.supabase.co/functions/v1/tally-webhook`
- ✅ Real Tally submissions arriving correctly
- ✅ UUID → label fix deployed (resolves option IDs via field.options map)

---

## 3. Dashboard ✅

- ✅ QR code panel → links to `tally.so/r/9qpyWG`
- ✅ `¡Iniciar pipeline!` button in header
- ✅ Bar chart: efectos más preocupantes (top_effects)
- ✅ Bar chart: actores relevantes (relevant_actors)
- ✅ Radar + scores numéricos: 6 ejes de relevancia
- ✅ Lista de propuestas abiertas
- ✅ Lista de todas las respuestas con timestamps
- ✅ Real-time via Supabase channel + 10s polling
- ✅ Estado vacío elegante mientras no hay respuestas

---

## 4. Pestaña Respuestas ✅

- ✅ Página `/responses` creada
- ✅ Stats resumen: participantes, con propuesta, con referente, relevancia media
- ✅ Cards colapsables por respuesta
- ✅ Detalle expandible: efectos, actores, barras de relevancia, propuesta, buena práctica
- ✅ Navbar actualizado con pestaña "Respuestas"

---

## 5. n8n Pipeline — Workshop Outputs

- ⬜ Duplicar workflow existente en n8n
- ⬜ Trigger: Webhook manual desde dashboard (botón "¡Iniciar pipeline!")
- ⬜ Nodo Supabase: leer `form_responses` donde `processed = false`
- ⬜ Adaptar prompts de IA al contexto turismo Barcelona
- ⬜ Output 1: **Post de Instagram** — irónico, dirigido al alcalde
- ⬜ Output 2: **PDF / Poster A4** — 3 propuestas para vecinos, imprimible
- ⬜ Marcar registros como `processed = true` tras generar
- ⬜ Test end-to-end con una respuesta real
- 📄 Ver guía completa: `N8N_SETUP.md`

---

## 6. RAG / Documentos de Contexto

- ⬜ Recopilar documentos relevantes:
  - Plan de regulación turística de Barcelona
  - Manifiesto / programa del Canodrom
  - Informes del consejo de distrito
- ⬜ Subir a vector DB (embeddings)
- ⬜ Conectar retrieval en pipeline n8n

---

## 7. Deployment

- ⬜ GitHub Pages auto-deploy (push a `main` → despliega)
- ⬜ Confirmar URL live: `https://espaifacto-code.github.io/canodrom-civic-ai/`
- ⬜ Compartir URL con equipo Canodrom antes del workshop

---

## 8. Día del Workshop

- ⬜ Test completo con 2-3 participantes de prueba antes de la sesión
- ⬜ QR impreso o en pantalla para que los participantes escaneen
- ⬜ Facilitador sabe cuándo pulsar "Iniciar pipeline" (al acabar todos de rellenar)
- ⬜ Pantalla lista para mostrar dashboard en directo durante la sesión
- ⬜ Posters A4 impresos como output del workshop

---

## Done log

| Fecha | Qué |
|-------|-----|
| 12 May 2026 | Proyecto forked, branding actualizado, Tally URL fijada, push a GitHub |
| 12 May 2026 | Supabase: tabla form_responses, Edge Function tally-webhook desplegada |
| 12 May 2026 | Dashboard reescrito: gráficas, radar, propuestas, QR, botón pipeline |
| 12 May 2026 | Fix UUID→label: resolveCheckbox con field.options map |
| 12 May 2026 | Pestaña Respuestas: cards colapsables con detalle completo por participante |
