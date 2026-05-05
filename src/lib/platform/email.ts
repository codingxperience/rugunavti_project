import { Resend } from "resend";

import { hasResend, platformEnv } from "@/lib/platform/env";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

let resendClient: Resend | null = null;

function getResend() {
  if (!hasResend || !platformEnv.resendApiKey) {
    return null;
  }

  resendClient ??= new Resend(platformEnv.resendApiKey);
  return resendClient;
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  const resend = getResend();

  if (!resend) {
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Ruguna College <noreply@ruguna.ac.ug>",
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
  } catch (error) {
    console.error("Transactional email failed", error);

    return { skipped: false, error: true };
  }

  return { skipped: false };
}
