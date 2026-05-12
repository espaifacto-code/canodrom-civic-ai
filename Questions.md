# Workshop Canodrom — Setup Questions

Answers to these questions define every configuration decision: branding, language, Supabase, Tally form, n8n pipeline, and deployment.

---

## 1. Workshop Content

**1.1 Topic / neighbourhood**
Does the workshop have a specific civic theme or area (e.g., urban mobility in Nou Barris, public space around Canodrom)? Or is it open to any civic issue?

> Answer:

**1.2 Language**
Should the form, app UI, and AI-generated proposals be in Catalan, Spanish, English, or a mix?

> Answer:

**1.3 Participant flow**
Will attendees fill in the form on their own phones during the session? Or will you demo it live with pre-filled / curated data?

> Answer:

**1.4 Number of participants**
Roughly how many people will submit during the workshop? (Affects database isolation strategy.)

> Answer:

---

## 2. Supabase (Database)

**2.1 New project or reuse existing?**
Do you want a brand-new isolated Supabase project for this workshop, or point to the existing one?
Recommendation: new project — keeps workshop data clean and separate.

> Answer:

**2.2 Pre-seeded demo data**
Do you want the dashboard to show example proposals before participants submit anything, so it looks alive from the start?

> Answer:

---

## 3. Tally Form (Citizen Input)

**3.1 New form or same?**
The current form (`tally.so/r/Y5OA8q`) is in English and generic. Does a Canodrom-specific form already exist, or does it need to be created?

> Answer:

**3.2 Form fields**
The pipeline needs these fields to work correctly. Confirm which ones the form will include:

- [ ] Participant name or identifier
- [ ] Neighbourhood / area
- [ ] Civic issue description (free text)
- [ ] Priorities or urgency
- [ ] Any other field specific to Canodrom?

> Answer:

---

## 4. n8n (AI Pipeline)

**4.1 Is the current workflow live?**
The `.env` shows the n8n webhook is commented out. Is the workflow at `mikelako.app.n8n.cloud` still active and usable?

> Answer:

**4.2 Workflow duplication**
Do you have the n8n workflow JSON exported so we can duplicate and adapt it? Or do we need to reconstruct it from scratch?

> Answer:

**4.3 AI prompt language and context**
The system prompts in the AI nodes currently generate proposals in English for generic civic issues.
- Should prompts be adapted to Catalan/Spanish?
- Should they reference Canodrom's specific context (neighbourhood, values, manifesto)?

> Answer:

**4.4 RAG / context documents**
The pipeline uses a vector database to ground proposals in real policy documents.
What documents should be loaded for Canodrom? Examples:
- Canodrom's own manifesto or programme
- Local urban planning documents
- District council reports

> Answer:

---

## 5. Deployment

**5.1 Where to deploy?**
GitHub Pages under a new repo (`canodrom-civic-ai`)? Or a different host?

> Answer:

**5.2 Offline requirement**
Does the app need to work without internet at the venue (e.g., run locally on a laptop)?

> Answer:

**5.3 GitHub organisation**
Should the new repo live under your personal account (`MikelLG`) or an organisation (e.g., `espaifacto-code` or a new Canodrom one)?

> Answer:

---

## Summary checklist (fill in after answering above)

| Item | Status |
|---|---|
| Workshop topic defined | ⬜ |
| Language decided | ⬜ |
| Supabase project created | ⬜ |
| Tally form created / URL confirmed | ⬜ |
| n8n workflow duplicated | ⬜ |
| n8n prompts adapted | ⬜ |
| RAG documents loaded | ⬜ |
| App branding updated | ✅ |
| Vite base path updated | ⬜ |
| GitHub repo created | ⬜ |
| App deployed | ⬜ |
