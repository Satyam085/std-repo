import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useForm } from "@tanstack/react-form";
import { env } from "cloudflare:workers";
import { useState } from "react";
import { z } from "zod";
import { adminOnly } from "#/lib/auth";
import { ManPage, Section } from "#/components/Man";

// Read by apps/web/src/routes/api/contact.ts. Keep the key and field names in sync.
const KEY = "settings:contact";
const schema = z.object({
  supportEmail: z.string().email("Enter a valid email address."),
  contactLimit: z.number().int().min(1, "At least 1.").max(1000, "At most 1000."),
  contactWindowSeconds: z.number().int().min(60, "KV needs at least 60 seconds.").max(86400),
});
type Settings = z.infer<typeof schema>;
const DEFAULTS: Settings = {
  supportEmail: "admin@example.com",
  contactLimit: 5,
  contactWindowSeconds: 60,
};

export const getSettings = createServerFn({ method: "GET" })
  .middleware([adminOnly])
  .handler(async () => ({ ...DEFAULTS, ...(await env.KV.get<Partial<Settings>>(KEY, "json")) }));

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([adminOnly])
  .validator(schema)
  .handler(async ({ data }) => {
    await env.KV.put(KEY, JSON.stringify(data));
  });

export const Route = createFileRoute("/settings")({
  loader: () => getSettings(),
  component: SettingsPage,
});

function SettingsPage() {
  const initial = Route.useLoaderData();
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const form = useForm({
    defaultValues: initial,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        await saveSettings({ data: value });
        setStatus({ ok: true, text: "Saved to KV. The storefront uses it on the next request." });
      } catch (err) {
        setStatus({ ok: false, text: err instanceof Error ? err.message : "Could not save." });
      }
    },
  });

  return (
    <ManPage
      name="settings"
      summary="Runtime settings for the storefront contact form, stored in KV and read on every submission."
      synopsis={<>loader → getSettings() → KV.get("{KEY}") · saveSettings() → KV.put</>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        noValidate
        className="divide-y divide-base-300"
      >
        <Section title="Contact" id="contact">
          <div className="grid gap-5 max-w-2xl">
            <form.Field name="supportEmail">
              {(field) => (
                <Row
                  id="supportEmail"
                  label="support email"
                  hint="Where contact form submissions are emailed."
                  error={field.state.meta.errors[0]?.message}
                >
                  <input
                    id="supportEmail"
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="field"
                  />
                </Row>
              )}
            </form.Field>
          </div>
        </Section>

        <Section title="Rate limit" id="rate-limit">
          <div className="grid gap-5 max-w-2xl">
            <form.Field name="contactLimit">
              {(field) => (
                <Row
                  id="contactLimit"
                  label="max submissions"
                  hint="Per IP per window. Past this, the form answers HTTP 429 with Retry-After."
                  error={field.state.meta.errors[0]?.message}
                >
                  <input
                    id="contactLimit"
                    type="number"
                    inputMode="numeric"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    className="field max-w-[12ch] tabular-nums"
                  />
                </Row>
              )}
            </form.Field>
            <form.Field name="contactWindowSeconds">
              {(field) => (
                <Row
                  id="contactWindowSeconds"
                  label="window (s)"
                  hint="Length of each counting window in seconds."
                  error={field.state.meta.errors[0]?.message}
                >
                  <input
                    id="contactWindowSeconds"
                    type="number"
                    inputMode="numeric"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    className="field max-w-[12ch] tabular-nums"
                  />
                </Row>
              )}
            </form.Field>
          </div>
        </Section>

        <div className="md:pl-[11rem] pt-6 flex flex-wrap items-center gap-3">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty] as const}>
            {([canSubmit, isSubmitting, isDirty]) => (
              <button
                type="submit"
                className="ctl ctl-primary -ml-2"
                disabled={!canSubmit || isSubmitting || !isDirty}
              >
                {isSubmitting ? "saving…" : "save settings"}
              </button>
            )}
          </form.Subscribe>
          <span
            role="status"
            className={`font-mono text-xs ${status?.ok === false ? "text-error" : "text-muted"}`}
          >
            {status?.text}
          </span>
        </div>
      </form>
    </ManPage>
  );
}

function Row({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4 sm:items-start">
      <label htmlFor={id} className="font-mono text-[13px] font-bold sm:pt-2">
        {label}
      </label>
      <div className="grid gap-1">
        {children}
        <p className={`text-xs ${error ? "text-error" : "text-muted"}`}>{error ?? hint}</p>
      </div>
    </div>
  );
}
