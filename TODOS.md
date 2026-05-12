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
- ⬜ Run `bun install` locally in `canodrom-civic-ai`
- ⬜ Confirm app runs: `bun dev`

---

## 2. Supabase — New Canodrom Project

- ⬜ Create new Supabase project (name: `canodrom-workshop`)
- ⬜ Run migration to create `civic_records` table (file: `supabase/migrations/`)
- ⬜ Copy new project URL + anon key into `.env`
- ⬜ Test connection: dashboard loads data

---

## 3. Dashboard — Ready for 13 May meeting 🔥

- ⬜ Add QR code panel → links to `tally.so/r/9qpyWG`
- ⬜ Update issue categories to tourism topics:
  - Vivienda / Housing
  - Espacio público / Public Space
  - Transporte / Transport
  - Identidad / Identity
  - Comercio local / Local Commerce
  - Ruido / Noise
  - Limpieza / Cleanliness
  - Derecho a la ciudad / Right to the City
- ⬜ Replace "Manual Trigger" tab with prominent **"Start Pipeline"** button
- ⬜ Live submissions list visible on main view (not hidden in a tab)
- ⬜ Language labels: Spanish / Catalan / English

---

## 4. n8n Pipeline — Workshop Outputs

- ⬜ Duplicate existing workflow in n8n
- ⬜ Update Tally webhook trigger → new form ID (`9qpyWG`)
- ⬜ Update Supabase node credentials → new Canodrom project
- ⬜ Adapt AI system prompts:
  - Topic: mass tourism in Barcelona
  - Language: Spanish / Catalan
  - Context: right to the city, urban sovereignty, coexistence
- ⬜ Add new output node: **Instagram post** (ironic, addressed to the mayor)
- ⬜ Add new output node: **A4 PDF poster** (printable, 3 proposals, for neighbours)
- ⬜ Store new outputs in Supabase (new columns or table)
- ⬜ Test full pipeline end-to-end with one test submission

---

## 5. RAG / Context Documents

- ⬜ Gather relevant documents:
  - Barcelona tourism regulation plans
  - Canodrom manifesto / programme
  - District council reports (relevant neighbourhood)
- ⬜ Upload documents to vector DB (embeddings)
- ⬜ Test retrieval in n8n pipeline

---

## 6. Frontend — Workshop Outputs Display

- ⬜ Install `react-qr-code` (`bun add react-qr-code`)
- ⬜ Dashboard panel: show generated Instagram post per submission
- ⬜ Dashboard panel: show PDF poster preview / download link
- ⬜ Explorer page: update to show tourism-specific fields
- ⬜ PDF submissions as public embeds (open to public)

---

## 7. Deployment

- ⬜ GitHub Pages auto-deploy working (push to `main` → deploys)
- ⬜ Confirm live URL: `https://espaifacto-code.github.io/canodrom-civic-ai/`
- ⬜ Share URL with Canodrom team before workshop

---

## 8. Workshop Day

- ⬜ Test full flow with 2-3 test participants before session
- ⬜ QR code printed or on screen for participants to scan
- ⬜ Facilitator knows how to press "Start Pipeline" after all submissions
- ⬜ Screen ready to show live dashboard during session
- ⬜ Printed A4 posters ready as workshop output

---

## Done log

| Date | What |
|------|------|
| 12 May | Project forked, branding updated, Tally URL fixed, pushed to GitHub |
