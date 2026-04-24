// Brevo transactional email helper.
// Reads BREVO_API_KEY from process.env. If missing, returns an error instead of crashing.

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const DEFAULT_SENDER = {
  name: "Foz em Foco",
  email: "newsletter@fozemfoco.com.br",
};
const BATCH_SIZE = 100;

export type BrevoRecipient = { email: string; name?: string };

export type BrevoResult =
  | { ok: true; sent: number; batches: number }
  | { ok: false; error: string; sent?: number };

export async function sendBrevoEmail({
  subject,
  html,
  recipients,
  sender,
}: {
  subject: string;
  html: string;
  recipients: BrevoRecipient[];
  sender?: { name: string; email: string };
}): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "BREVO_API_KEY não configurada" };
  }
  if (!recipients.length) {
    return { ok: true, sent: 0, batches: 0 };
  }

  const from = sender ?? DEFAULT_SENDER;
  let sent = 0;
  let batches = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    // Use messageVersions so each recipient gets their own message (no leaked bcc list).
    const payload = {
      sender: from,
      subject,
      htmlContent: html,
      // Brevo requires at least one `to` at the top level; use the first recipient
      // and move the rest into messageVersions so every subscriber gets an individual copy.
      to: [{ email: chunk[0].email, name: chunk[0].name }],
      messageVersions: chunk.slice(1).map((r) => ({
        to: [{ email: r.email, name: r.name }],
      })),
    };

    try {
      const res = await fetch(BREVO_ENDPOINT, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          ok: false,
          error: `Brevo API ${res.status}: ${text.slice(0, 300)}`,
          sent,
        };
      }
      sent += chunk.length;
      batches += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: `Falha ao chamar Brevo: ${msg}`, sent };
    }
  }

  return { ok: true, sent, batches };
}
