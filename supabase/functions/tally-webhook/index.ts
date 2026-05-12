import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Extracts short category from "Vivienda: Alquileres caros..." → "Vivienda"
function shortLabel(value: string): string {
  return value.split(":")[0].trim();
}

// Find a field by matching keywords in its label (case-insensitive)
function findField(fields: any[], ...keywords: string[]): any {
  return fields.find((f) =>
    keywords.every((kw) => f.label?.toLowerCase().includes(kw.toLowerCase()))
  );
}

// Resolve checkbox field values to human-readable labels.
// Tally sends value = ["option_uuid1", ...] and field.options = [{id, text}, ...]
function resolveCheckbox(field: any): string[] {
  if (!field || !Array.isArray(field.value)) return [];

  // Build id → text map from field.options
  const optMap: Record<string, string> = {};
  if (Array.isArray(field.options)) {
    for (const opt of field.options) {
      if (opt.id) optMap[opt.id] = opt.text ?? opt.id;
    }
  }

  return field.value.map((item: any) => {
    if (item && typeof item === "object") {
      // Object with text property
      return String(item.text ?? item.id ?? item);
    }
    const raw = String(item);
    return optMap[raw] ?? raw; // resolve UUID → label, or keep as-is
  });
}

// Get numeric value from a field (handles string and number)
function numVal(field: any): number | null {
  if (!field || field.value === null || field.value === undefined) return null;
  const n = Number(field.value);
  return isNaN(n) ? null : n;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // Log the raw payload for debugging
  console.log("Tally payload:", JSON.stringify(payload, null, 2));

  const fields: any[] = payload?.data?.fields ?? [];

  // ── Q1: Top 3 effects (CHECKBOXES) ──────────────────────────────────────
  const effectsField = findField(fields, "efectos", "turismo") ??
                       findField(fields, "preocupan");
  const top_effects: string[] = resolveCheckbox(effectsField)
    .map(shortLabel)
    .filter(Boolean);

  // ── Q2: Relevance scores (RATING or MATRIX) ─────────────────────────────
  let rel_digital: number | null = null;
  let rel_political: number | null = null;
  let rel_data: number | null = null;
  let rel_economy: number | null = null;
  let rel_environment: number | null = null;
  let rel_city: number | null = null;

  // Try MATRIX field first
  const matrixField = findField(fields, "relevancia") ??
                      findField(fields, "importancia") ??
                      findField(fields, "ejes");

  if (matrixField?.type === "MATRIX" && matrixField.value) {
    // Tally sends: value = { rowId: columnId, ... }
    // rows = [{id, text}, ...]  columns = [{id, text}, ...]  (1=col[0] … 5=col[4])

    // Build rowId → label map
    const rowMap: Record<string, string> = {};
    if (Array.isArray(matrixField.rows)) {
      for (const r of matrixField.rows) {
        if (r.id) rowMap[r.id] = r.text ?? r.id;
      }
    }

    // Build columnId → numeric rating map (index + 1, or parse text)
    const colMap: Record<string, number> = {};
    if (Array.isArray(matrixField.columns)) {
      matrixField.columns.forEach((c: any, i: number) => {
        if (c.id) colMap[c.id] = isNaN(Number(c.text)) ? i + 1 : Number(c.text);
      });
    }

    const assignRel = (rowLabel: string, numVal: number) => {
      const k = rowLabel.toLowerCase();
      if (k.includes("digital") || k.includes("plataforma")) rel_digital = numVal;
      else if (k.includes("pol") || k.includes("marco")) rel_political = numVal;
      else if (k.includes("transparencia") || k.includes("datos")) rel_data = numVal;
      else if (k.includes("proximidad") || k.includes("econom")) rel_economy = numVal;
      else if (k.includes("ambiental") || k.includes("impacto")) rel_environment = numVal;
      else if (k.includes("derecho") || k.includes("ciudad")) rel_city = numVal;
    };

    if (Array.isArray(matrixField.value)) {
      // Format: [{rowId, columnId}, ...]
      for (const entry of matrixField.value) {
        const label = rowMap[entry.rowId] ?? entry.rowId ?? "";
        const num = colMap[entry.columnId] ?? Number(entry.columnId) ?? null;
        if (label && num !== null && !isNaN(num)) assignRel(label, num);
      }
    } else {
      // Format: { rowIdOrLabel: columnIdOrNumber, ... }
      for (const [rowKey, colVal] of Object.entries(matrixField.value)) {
        const label = rowMap[rowKey] ?? rowKey;
        const num = colMap[String(colVal)] ?? (isNaN(Number(colVal)) ? null : Number(colVal));
        if (label && num !== null && num !== undefined) assignRel(label, num as number);
      }
    }
  } else {
    // Individual fields per row
    rel_digital = numVal(findField(fields, "digital") ?? findField(fields, "plataforma"));
    rel_political = numVal(findField(fields, "pol") ?? findField(fields, "marco"));
    rel_data = numVal(findField(fields, "transparencia"));
    rel_economy = numVal(findField(fields, "proximidad"));
    rel_environment = numVal(findField(fields, "ambiental"));
    rel_city = numVal(findField(fields, "derecho") ?? findField(fields, "ciudad"));
  }

  // ── Q3: Open proposal ───────────────────────────────────────────────────
  const proposalField = findField(fields, "idea", "propon") ??
                        findField(fields, "comprometa") ??
                        findField(fields, "propuesta");
  const proposal_idea: string | null = proposalField?.value ?? null;

  // ── Q4: Relevant actors (CHECKBOXES) ────────────────────────────────────
  const actorsField = findField(fields, "actor");
  const relevant_actors: string[] = resolveCheckbox(actorsField);

  // ── Q5: Good practices (TEXT) ────────────────────────────────────────────
  const practicesField = findField(fields, "referente") ??
                          findField(fields, "buena pr") ??
                          findField(fields, "conoces");
  const good_practices: string | null = practicesField?.value ?? null;

  // ── Insert into Supabase ─────────────────────────────────────────────────
  const record = {
    top_effects,
    relevance_digital_platforms: rel_digital,
    relevance_political_framework: rel_political,
    relevance_data_transparency: rel_data,
    relevance_proximity_economy: rel_economy,
    relevance_environmental_impact: rel_environment,
    relevance_right_to_city: rel_city,
    proposal_idea,
    relevant_actors,
    good_practices,
    tally_response_id: payload?.data?.responseId ?? null,
  };

  console.log("Inserting record:", JSON.stringify(record, null, 2));

  const { error } = await supabase.from("form_responses").insert(record);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
