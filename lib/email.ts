// Server-only helper for sending transactional email via Resend.
// Used to notify Matt the moment a guest requests a week. Sending must
// never block a real booking — every call site wraps this in try/catch
// and treats it as best-effort.

// Set as environment variables in Vercel (Project Settings -> Environment
// Variables) — never hardcoded here so the key can't leak via git.
const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "matthew.gajdus@gmail.com";
// Resend's shared sandbox sender — works with no domain setup, but (until a
// sending domain is verified in the Resend dashboard) can only deliver to
// the address the Resend account itself was created with.
const FROM_EMAIL = "The Summer House <onboarding@resend.dev>";

export async function sendBookingRequestEmail(details: {
  guestName: string;
  startDate: string;
  endDate: string;
  agreedPrice: string | null;
  depositAmount: string | null;
  isReturning: boolean;
}): Promise<void> {
  const { guestName, startDate, endDate, agreedPrice, depositAmount, isReturning } = details;

  const subject = `New week requested: ${startDate} – ${endDate}`;
  const text = [
    `${guestName} has just requested ${startDate} – ${endDate}${isReturning ? " (returning guest / loyalty rate)" : ""}.`,
    "",
    `Total: £${agreedPrice ?? "—"}`,
    `Deposit due: £${depositAmount ?? "—"}`,
    "",
    "Once the deposit's in, head to /admin and click \"Mark deposit paid\" to unlock their page.",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend email failed (${res.status}): ${body}`);
  }
}
