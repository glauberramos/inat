// Cloudflare Worker that proxies Lifelist Curator ranking requests to
// TypeSafe AI's Jev model. The pages on this site are static, so calling
// TypeSafe directly from the browser would expose the API key to every
// visitor — this worker keeps the key server-side.
//
// This file is NOT loaded by any page; deploy it separately:
//   1. wrangler deploy jev-proxy-worker.js
//   2. wrangler secret put TYPESAFE_API_KEY   (key from console.typesafe.ai)
//   3. Optionally set vars: ALLOWED_ORIGIN, JEV_API_URL, MAX_ITEMS
//   4. On lifelist-curator.html, paste the worker URL into the
//      "Jev proxy URL" field (stored in localStorage).
//
// Contract with the page — POST <worker-url> with:
//   { "items": [ { "id": "...", "state": "...", "questions": { ... } }, ... ] }
// and the worker answers:
//   { "results": [ { "id": "...", "answers": { ... } | null }, ... ] }
// Each item is forwarded to the TypeSafe API as-is (state + questions), so
// the question format lives in lifelist-curator.js, not here.
//
// NOTE: Jev is in early access. Confirm the exact HTTP endpoint and
// response field names against https://docs.typesafe.ai (HTTP API
// reference) — JEV_API_URL below is a placeholder default, and
// extractAnswers() normalizes the response shape in one place so only that
// function should need adjusting.

const DEFAULTS = {
  ALLOWED_ORIGIN: "https://glauberramos.github.io",
  JEV_API_URL: "https://api.typesafe.ai/v1/evaluate",
  MAX_ITEMS: 100,
  CONCURRENCY: 8,
};

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || DEFAULTS.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

// Pull the per-question answers out of a TypeSafe API response. Kept
// separate so endpoint/schema drift during early access is a one-function
// fix. Expected shape (per docs.typesafe.ai): { answers: { <question>: ... } }.
function extractAnswers(payload) {
  if (payload && typeof payload === "object" && payload.answers) {
    return payload.answers;
  }
  return null;
}

async function evaluateItem(item, env) {
  try {
    const response = await fetch(env.JEV_API_URL || DEFAULTS.JEV_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.TYPESAFE_API_KEY}`,
      },
      body: JSON.stringify({ state: item.state, questions: item.questions }),
    });
    if (!response.ok) return { id: item.id, answers: null };
    return { id: item.id, answers: extractAnswers(await response.json()) };
  } catch {
    return { id: item.id, answers: null };
  }
}

// Run items in small batches so one request from the page fans out to Jev
// without hammering it all at once.
async function evaluateAll(items, env) {
  const concurrency = Number(env.CONCURRENCY) || DEFAULTS.CONCURRENCY;
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    results.push(...(await Promise.all(batch.map((item) => evaluateItem(item, env)))));
  }
  return results;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    if (request.method !== "POST") {
      return jsonResponse({ error: "POST only" }, 405, env);
    }
    if (!env.TYPESAFE_API_KEY) {
      return jsonResponse({ error: "TYPESAFE_API_KEY secret is not configured" }, 500, env);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, env);
    }

    const items = Array.isArray(body && body.items) ? body.items : null;
    const maxItems = Number(env.MAX_ITEMS) || DEFAULTS.MAX_ITEMS;
    if (!items || items.length === 0 || items.length > maxItems) {
      return jsonResponse(
        { error: `items must be a non-empty array of at most ${maxItems}` },
        400,
        env
      );
    }
    for (const item of items) {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.state !== "string" ||
        !item.questions
      ) {
        return jsonResponse({ error: "each item needs id, state and questions" }, 400, env);
      }
    }

    return jsonResponse({ results: await evaluateAll(items, env) }, 200, env);
  },
};
