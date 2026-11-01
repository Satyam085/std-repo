import { createFileRoute } from "@tanstack/react-router";
import {
  checkRateLimit,
  createRateLimitErrorResponse,
  getRateLimitHeaders,
} from "@repo/rate-limit";
import { createEmailService, notificationEmail } from "@repo/email";
import { createDb, contacts } from "@repo/db";
import { env } from "cloudflare:workers";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Rate limiting via Cloudflare KV (max 5 submissions per minute per IP)
        const rateLimitResult = await checkRateLimit(env.KV, request, {
          limit: 5,
          windowSeconds: 60,
          prefix: "contact-rl",
        });

        if (!rateLimitResult.success) {
          return createRateLimitErrorResponse(rateLimitResult);
        }

        try {
          const body = await request.json();
          const parsed = contactSchema.parse(body);

          // 2. Persist contact inquiry to D1 SQLite
          const db = createDb(env.DB);
          await db.insert(contacts).values({
            id: crypto.randomUUID(),
            name: parsed.name,
            email: parsed.email,
            subject: parsed.subject,
            message: parsed.message,
            createdAt: new Date(),
          });

          // 3. Send email notification via Resend
          const emailService = createEmailService({
            apiKey: env.RESEND_API_KEY,
          });

          const emailContent = notificationEmail({
            title: `New Storefront Inquiry: ${parsed.subject}`,
            message: `From: ${parsed.name} (${parsed.email})\n\nMessage:\n${parsed.message}`,
          });

          await emailService.send({
            to: "admin@example.com",
            subject: `[Contact Form] ${parsed.subject}`,
            html: emailContent.html,
            text: emailContent.text,
          });

          return new Response(
            JSON.stringify({
              success: true,
              message: "Thank you! Your message has been sent successfully.",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                ...getRateLimitHeaders(rateLimitResult),
              },
            },
          );
        } catch (err: unknown) {
          const message =
            err instanceof z.ZodError ? err.errors[0]?.message : "Invalid request data";
          return new Response(JSON.stringify({ error: message }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...getRateLimitHeaders(rateLimitResult),
            },
          });
        }
      },
    },
  },
});
