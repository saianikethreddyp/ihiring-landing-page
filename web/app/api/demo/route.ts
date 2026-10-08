import { demoForm } from "@/lib/site";

// Set DEMO_WEBHOOK_URL to a CRM / form service before accepting requests.
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ["name", "organizationName", "jobTitle", "email", "phoneNumber", "source"] as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: "Invalid fields" }, { status: 422 });
  }

  const lead: Record<string, string> = {};
  const fields = body as Record<string, unknown>;
  for (const k of FIELDS) {
    const value = fields[k] ?? "";
    if (typeof value !== "string" || value.trim().length > 200) {
      return Response.json({ ok: false, error: "Invalid fields" }, { status: 422 });
    }
    lead[k] = value.trim();
  }
  const sourceOptions = demoForm.find(field => field.name === "source");
  const validSource = sourceOptions && "options" in sourceOptions && sourceOptions.options?.includes(lead.source);

  if (!lead.name || !lead.organizationName || !lead.jobTitle || !emailRe.test(lead.email) || !validSource) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  const webhook = process.env.DEMO_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!res?.ok) return Response.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  } else {
    return Response.json({ ok: false, error: "Demo requests temporarily unavailable" }, { status: 503 });
  }

  return Response.json({ ok: true });
}
