import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

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

        setStatus({ type: "success", message: data.message || "Success" });
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Contact & Support</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
          Powered by <strong>TanStack Form</strong>, verified by Cloudflare KV{" "}
          <strong>Rate Limiting</strong>, and delivered through <strong>Resend</strong>.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {status.type === "success" && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm font-medium">
            ✓ {status.message}
          </div>
        )}

        {status.type === "error" && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm font-medium">
            ⚠ {status.message}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3.5 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-red-500">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3.5 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-red-500">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Subject
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Question about an order"
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3.5 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-red-500">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                    placeholder="How can we help you today?"
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3.5 py-2 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">Rate limited to 5 requests per min</span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
