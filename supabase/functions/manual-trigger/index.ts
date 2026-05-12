import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed." });
  }

  const webhookUrl = Deno.env.get("N8N_WEBHOOK_URL");

  if (!webhookUrl) {
    return jsonResponse({
      ok: false,
      error: "N8N_WEBHOOK_URL is not configured for the manual-trigger function.",
    });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body." });
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = webhookResponse.headers.get("content-type") ?? "";
    const result = contentType.includes("application/json")
      ? await webhookResponse.json()
      : await webhookResponse.text();

    return jsonResponse({
      ok: webhookResponse.ok,
      status: webhookResponse.status,
      statusText: webhookResponse.statusText,
      result,
      error: webhookResponse.ok
        ? undefined
        : typeof result === "string"
          ? result
          : result?.error ?? result?.message ?? `n8n webhook returned ${webhookResponse.status}.`,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Failed to reach the n8n webhook.",
    });
  }
});