# n8n Setup — Workshop Canodrom

> Pipeline de generación de outputs al final del workshop.
> Se activa manualmente con el botón **"¡Iniciar pipeline!"** del dashboard.

---

## Arquitectura del flujo

```
Dashboard (botón)
    ↓  POST webhook
n8n Workflow
    ↓
[1] Leer form_responses de Supabase (processed = false)
    ↓
[2] Agregar y resumir respuestas (Claude / GPT)
    ↓
[3a] Generar POST DE INSTAGRAM
[3b] Generar POSTER A4 PDF
    ↓
[4] Marcar registros processed = true en Supabase
    ↓
[5] (Opcional) Guardar outputs en Supabase / Drive
```

---

## Paso 1 — Duplicar el workflow existente

1. Abrir n8n → **Workflows**
2. Buscar el workflow original de civic-voice-ai
3. Clic en los 3 puntos → **Duplicate**
4. Renombrar: `canodrom-workshop`
5. Desactivar el workflow original (para no confundirlos)

---

## Paso 2 — Trigger: Webhook manual

El botón "¡Iniciar pipeline!" del dashboard hace un POST a n8n.

1. En el workflow duplicado, abre el nodo **Trigger**
2. Cambia el tipo a **Webhook** (método POST)
3. Copia la URL generada por n8n
4. En el archivo `src/components/dashboard/ManualTrigger.tsx`, actualiza la variable `N8N_WEBHOOK_URL` con esa URL

```typescript
// ManualTrigger.tsx — busca esta línea y cambia la URL
const N8N_WEBHOOK_URL = "https://TU_N8N_URL/webhook/canodrom-workshop";
```

---

## Paso 3 — Leer respuestas de Supabase

1. Añade nodo **Supabase** (o HTTP Request si no tienes el nodo)
2. Credenciales: URL `https://efvbridamwouyvakfnai.supabase.co`, usar service_role key
3. Operación: **Select**
4. Tabla: `form_responses`
5. Filtro: `processed = false`
6. Ordenar por `created_at` ascendente

**Columnas que necesitas:**
| Columna | Uso |
|---------|-----|
| `top_effects` | Array de efectos más mencionados |
| `relevance_*` | Puntuaciones de los 6 ejes |
| `proposal_idea` | Propuestas abiertas de los participantes |
| `relevant_actors` | Actores señalados |
| `good_practices` | Referencias externas citadas |

---

## Paso 4 — Nodo de agregación / resumen

Antes de llamar a la IA, agrega los datos en un solo objeto.

Añade un nodo **Code** con algo como:

```javascript
const items = $input.all();
const responses = items.map(i => i.json);

// Top 3 efectos más mencionados
const effectCounts = {};
responses.forEach(r => {
  (r.top_effects || []).forEach(e => {
    effectCounts[e] = (effectCounts[e] || 0) + 1;
  });
});
const topEffects = Object.entries(effectCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([name]) => name);

// Propuestas
const proposals = responses
  .filter(r => r.proposal_idea)
  .map(r => r.proposal_idea);

// Relevancia media por eje
const axes = [
  'relevance_digital_platforms',
  'relevance_political_framework',
  'relevance_data_transparency',
  'relevance_proximity_economy',
  'relevance_environmental_impact',
  'relevance_right_to_city',
];
const avgRelevance = {};
axes.forEach(key => {
  const vals = responses.map(r => r[key]).filter(v => v !== null);
  avgRelevance[key] = vals.length
    ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    : null;
});

return [{
  json: {
    totalResponses: responses.length,
    topEffects,
    proposals,
    avgRelevance,
    allIds: responses.map(r => r.id),
  }
}];
```

---

## Paso 5a — Generar Post de Instagram

Añade nodo **AI / Claude** (o OpenAI):

**System prompt:**
```
Eres un comunicador urbano activista que trabaja en Barcelona.
Creas posts de Instagram en tono irónico y directo, dirigidos al alcalde de Barcelona.
El post debe:
- Ser en español o catalán
- Tener entre 150-250 palabras
- Empezar con una frase irónica dirigida al alcalde
- Resumir los 3 efectos más preocupantes que señalan los vecinos
- Incluir 1-2 propuestas concretas
- Terminar con una llamada a la acción ciudadana
- Incluir 5-8 hashtags relevantes (#TurismeMassiuBCN #DretALaCiutat etc.)
```

**User prompt (dinámico):**
```
Datos del workshop Canodrom sobre turismo masivo en Barcelona:

Participantes: {{$json.totalResponses}}
Efectos más preocupantes: {{$json.topEffects.join(', ')}}
Propuestas de los vecinos:
{{$json.proposals.map((p, i) => `${i+1}. ${p}`).join('\n')}}

Genera el post de Instagram.
```

---

## Paso 5b — Generar Poster A4

Añade otro nodo **AI / Claude**:

**System prompt:**
```
Eres un diseñador de comunicación ciudadana.
Generas el TEXTO para un poster A4 imprimible dirigido a los vecinos de Barcelona.
El poster debe:
- Título impactante en grande
- Subtítulo explicando el problema
- 3 propuestas concretas numeradas (las más votadas del workshop)
- Datos del workshop (fecha, participantes)
- Call to action: cómo unirse / siguiente paso
- Formato: usa markdown con # ## y listas claras
- Tono: combativo pero constructivo, lenguaje accesible
- Idioma: español con alguna frase en catalán
```

**User prompt (dinámico):**
```
Workshop: Turismo masivo en Barcelona — Canodrom, {{new Date().toLocaleDateString('es-ES')}}
Participantes: {{$json.totalResponses}} vecinos

Efectos más preocupantes:
{{$json.topEffects.map((e, i) => `${i+1}. ${e}`).join('\n')}}

Propuestas de los participantes:
{{$json.proposals.slice(0, 5).map((p, i) => `${i+1}. ${p}`).join('\n')}}

Genera el texto del poster A4.
```

---

## Paso 6 — Marcar como procesados

Añade nodo **Supabase** (o HTTP Request):
- Operación: **Update**
- Tabla: `form_responses`
- Campo: `processed = true`
- Filtro: `id` in `{{$json.allIds}}`

O con HTTP Request directo:
```
PATCH https://efvbridamwouyvakfnai.supabase.co/rest/v1/form_responses?id=in.({{ids}})
Headers:
  apikey: [service_role_key]
  Authorization: Bearer [service_role_key]
  Content-Type: application/json
Body: {"processed": true}
```

---

## Paso 7 — (Opcional) Guardar outputs

Para mostrar los resultados en el dashboard después:

1. Crea una tabla `pipeline_outputs` en Supabase:
```sql
CREATE TABLE public.pipeline_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  instagram_post TEXT,
  poster_a4 TEXT,
  total_responses INT,
  top_effects TEXT[]
);
```

2. Añade nodo Supabase Insert con los textos generados

---

## Credenciales necesarias

| Servicio | Valor |
|----------|-------|
| Supabase URL | `https://efvbridamwouyvakfnai.supabase.co` |
| Supabase anon key | Ver `.env` del proyecto |
| Supabase service_role key | Ver Supabase dashboard → Settings → API |
| n8n webhook URL | Generada al crear el nodo Webhook en n8n |

> ⚠️ **Importante:** Rota la service_role key si fue expuesta. Ve a Supabase → Settings → API → Regenerate.

---

## Test del flujo completo

1. Asegúrate de tener al menos 3-5 respuestas reales en `form_responses`
2. En n8n, activa el workflow
3. Usa **"Test workflow"** y envía un POST manual al webhook
4. Revisa cada nodo para confirmar que los datos pasan correctamente
5. Verifica que el texto generado tiene sentido y tono correcto
6. Ajusta los prompts si es necesario
7. En el dashboard, pulsa **"¡Iniciar pipeline!"** para test real
