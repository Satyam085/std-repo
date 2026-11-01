import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Send, Shield } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      setStatus({ type: "idle", message: "" });

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = (await res.json()) as { message?: string; error?: string };

        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to submit form");
        }

        setStatus({ type: "success", message: data.message || "Message sent successfully!" });
        form.reset();
      } catch (err: unknown) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "An error occurred during submission",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="page-container max-w-2xl py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight">Get in Touch</h1>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          Built with <strong>TanStack Form</strong>, protected by Cloudflare KV{" "}
          <strong>sliding-window rate limiting</strong>, and dispatched via <strong>Resend</strong>.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-8 sm:p-10">
        {status.type === "success" && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            ✓ {status.message}
          </div>
        )}

        {status.type === "error" && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            ⚠ {status.message}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <div>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? "Name is required" : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Email is required"
                    : !value.includes("@")
                      ? "Invalid email address"
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id={field.name}
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field
              name="subject"
              validators={{
                onChange: ({ value }) => (!value ? "Subject is required" : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Question about your services"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field
              name="message"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Message is required"
                    : value.length < 10
                      ? "At least 10 characters required"
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id={field.name}
                    rows={4}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="How can we assist you?"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>Edge rate limited (5 req / min)</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
