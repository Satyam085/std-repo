import { Resend } from "resend";

export interface EmailServiceConfig {
  apiKey?: string;
  fromEmail?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export function createEmailService(config: EmailServiceConfig = {}) {
  const envProcess =
    typeof globalThis !== "undefined" && "process" in globalThis
      ? (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
          .process
      : undefined;
  const apiKey = config.apiKey || envProcess?.env?.RESEND_API_KEY;
  const fromEmail = config.fromEmail || "onboarding@resend.dev";

  const isMock = !apiKey || apiKey === "re_placeholder" || apiKey.startsWith("test_");

  const client = !isMock ? new Resend(apiKey) : null;

  return {
    isMock,
    async send(options: SendEmailOptions) {
      if (isMock || !client) {
        console.log(`\n📧 [EMAIL MOCK DEV] ----------------------------`);
        console.log(`From:    ${fromEmail}`);
        console.log(`To:      ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Preview: ${options.text || options.html.slice(0, 150)}...`);
        console.log(`------------------------------------------------\n`);
        return { data: { id: `mock-${Date.now()}` }, error: null };
      }

      const res = await client.emails.send({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return res;
    },
  };
}

export type EmailService = ReturnType<typeof createEmailService>;
