import { demoForm } from "@/lib/site";

// Demo requests go to Microsoft Teams (TEAMS_WEBHOOK_URL) and/or email via Resend (RESEND_API_KEY). Set at least one.
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

  const teamsUrl = process.env.TEAMS_WEBHOOK_URL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!teamsUrl && !apiKey) {
    return Response.json({ ok: false, error: "Demo requests temporarily unavailable" }, { status: 503 });
  }

  const esc = (v: string) => v.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const rows: [string, string][] = [
    ["Name", lead.name], ["Company", lead.organizationName], ["Job title", lead.jobTitle],
    ["Work email", lead.email], ["Phone", lead.phoneNumber || "Not provided"], ["Heard about us from", lead.source],
  ];
  const failed: string[] = [];

  if (teamsUrl) {
    // Teams "Workflows" webhook (Post to a channel when a webhook request is received) takes an Adaptive Card.
    const res = await fetch(teamsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "message",
        attachments: [{
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              { type: "TextBlock", text: "New demo request", weight: "Bolder", size: "Large" },
              { type: "FactSet", facts: rows.map(([title, value]) => ({ title, value })) },
            ],
          },
        }],
      }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!res?.ok) failed.push("teams");
  }

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: process.env.DEMO_MAIL_FROM ?? "ihiring website <onboarding@resend.dev>",
        to: [process.env.DEMO_MAIL_TO ?? "aaniketh@cloudbers.com"],
        reply_to: lead.email,
        subject: `New demo request: ${lead.name} (${lead.organizationName})`,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<h2>New demo request</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>`,
      }),
      signal: AbortSignal.timeout(10000),
    }).catch(() => null);
    if (!res?.ok) failed.push("email");
  }

  // Fail only if every configured channel failed, so one outage never loses a lead.
  const configured = Number(!!teamsUrl) + Number(!!apiKey);
  if (failed.length >= configured) return Response.json({ ok: false, error: "Delivery failed" }, { status: 502 });

  return Response.json({ ok: true });
}
