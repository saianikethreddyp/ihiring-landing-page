// Demo-request endpoint.
// TODO(ihiring): set DEMO_WEBHOOK_URL (CRM / Slack / form service) so requests are delivered.
// Without it, requests are only logged on the server and nothing is stored.
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ["name", "organizationName", "jobTitle", "email", "phoneNumber", "source"] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead: Record<string, string> = {};
  for (const k of FIELDS) lead[k] = String(body[k] ?? "").trim().slice(0, 200);

  if (!lead.name || !lead.organizationName || !lead.jobTitle || !emailRe.test(lead.email) || !lead.source) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  const webhook = process.env.DEMO_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
    }).catch(() => null);
    if (!res?.ok) return Response.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  } else {
    console.warn("[demo] DEMO_WEBHOOK_URL not set; lead not delivered:", lead.email);
  }

  return Response.json({ ok: true });
}
