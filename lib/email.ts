import { Resend } from "resend";

let client: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

const FROM = process.env.EMAIL_FROM || "FOILFALL <onboarding@resend.dev>";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends through Resend when RESEND_API_KEY is set; otherwise logs to the
 * server console so every flow that depends on email (password reset,
 * order confirmations) still works end-to-end in local dev without an
 * email account configured. See README for setup.
 */
async function send({ to, subject, html }: SendArgs): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(`[email:not-configured] would send "${subject}" to ${to}\n${html}`);
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html });
}

function wrapper(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;background:#08090b;padding:32px;color:#f4f5f7">
      <div style="max-width:480px;margin:0 auto;background:#0f1114;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px">
        <div style="font-weight:800;font-size:18px;background:linear-gradient(90deg,#8b5cf6,#22d3ee,#f5c451);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:16px">
          FOILFALL
        </div>
        <h1 style="font-size:18px;margin:0 0 12px">${title}</h1>
        ${bodyHtml}
        <p style="margin-top:24px;font-size:12px;color:#9aa0ac">Every rip is real.</p>
      </div>
    </div>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await send({
    to,
    subject: "Welcome to FOILFALL — 100 tokens on us",
    html: wrapper(
      `Welcome, ${name}`,
      `<p style="color:#c4c8cf;font-size:14px;line-height:1.6">Your account is live with 100 free tokens. Head to the Pack Shop and rip your first pack.</p>`
    ),
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send({
    to,
    subject: "Reset your FOILFALL password",
    html: wrapper(
      "Reset your password",
      `<p style="color:#c4c8cf;font-size:14px;line-height:1.6">Click below to set a new password. This link expires in 30 minutes and works once.</p>
       <a href="${resetUrl}" style="display:inline-block;margin-top:12px;background:linear-gradient(90deg,#8b5cf6,#22d3ee);color:#000;font-weight:700;padding:10px 20px;border-radius:999px;text-decoration:none">Reset password</a>
       <p style="margin-top:16px;font-size:12px;color:#9aa0ac">Didn't request this? You can ignore this email.</p>`
    ),
  });
}

export async function sendShipRequestedEmail(to: string, cardName: string) {
  await send({
    to,
    subject: `Ship request received — ${cardName}`,
    html: wrapper(
      "Your ship request is in",
      `<p style="color:#c4c8cf;font-size:14px;line-height:1.6">We've logged your request to ship <strong>${cardName}</strong>. You'll get another email the moment it's on its way.</p>`
    ),
  });
}

export async function sendShippedEmail(to: string, cardName: string, carrier: string, trackingNumber: string) {
  await send({
    to,
    subject: `Your card shipped — ${cardName}`,
    html: wrapper(
      "It's on its way",
      `<p style="color:#c4c8cf;font-size:14px;line-height:1.6"><strong>${cardName}</strong> shipped via ${carrier}.</p>
       <p style="margin-top:8px;font-family:monospace;font-size:13px;color:#f5c451">${trackingNumber}</p>`
    ),
  });
}
