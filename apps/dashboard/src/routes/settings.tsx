import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Save, Check, Sliders, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const form = useForm({
    defaultValues: {
      siteName: "Production Edge Monorepo",
      supportEmail: "support@example.com",
      rateLimitWindow: 60,
      rateLimitMax: 10,
      enablePublicSignup: true,
      logLevel: "info",
    },
    onSubmit: async () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">System Settings</h1>
        <p className="text-xs text-base-content/70 mt-1">
          Configure runtime environment variables, Cloudflare KV rate limiting thresholds, and
          security policies.
        </p>
      </div>

      {saved && (
        <div className="alert alert-success shadow-sm text-xs py-3 rounded-xl border border-success/30">
          <Check className="w-4 h-4" />
          <span className="font-semibold">Settings preferences saved successfully!</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* General Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-base-content/70" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/80">
                  General Properties
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <form.Field name="siteName">
                    {(field) => (
                      <div className="form-control">
                        <label className="label py-1" htmlFor="settings-sitename">
                          <span className="label-text text-xs font-semibold">
                            Application Title
                          </span>
                        </label>
                        <input
                          id="settings-sitename"
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full input-sm text-xs"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field name="supportEmail">
                    {(field) => (
                      <div className="form-control">
                        <label className="label py-1" htmlFor="settings-supportemail">
                          <span className="label-text text-xs font-semibold">
                            Support Contact Email
                          </span>
                        </label>
                        <input
                          id="settings-supportemail"
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="input input-bordered w-full input-sm text-xs"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            <div className="divider my-2"></div>

            {/* Edge Rate Limiting Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-base-content/70" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/80">
                  Cloudflare KV Sliding Window Limiter
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <form.Field name="rateLimitMax">
                    {(field) => (
                      <div className="form-control">
                        <label className="label py-1" htmlFor="settings-ratelimitmax">
                          <span className="label-text text-xs font-semibold">
                            Max Requests per Window
                          </span>
                        </label>
                        <input
                          id="settings-ratelimitmax"
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="input input-bordered w-full input-sm text-xs tabular-nums"
                        />
                        <span className="text-[11px] text-base-content/60 mt-1">
                          Requests allowed before HTTP 429 Retry-After is triggered.
                        </span>
                      </div>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field name="rateLimitWindow">
                    {(field) => (
                      <div className="form-control">
                        <label className="label py-1" htmlFor="settings-ratelimitwindow">
                          <span className="label-text text-xs font-semibold">
                            Window TTL (Seconds)
                          </span>
                        </label>
                        <input
                          id="settings-ratelimitwindow"
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="input input-bordered w-full input-sm text-xs tabular-nums"
                        />
                        <span className="text-[11px] text-base-content/60 mt-1">
                          Sliding window interval tracked in Cloudflare KV.
                        </span>
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            <div className="divider my-2"></div>

            {/* Public Registration Switch */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="font-semibold text-xs text-base-content">
                  Public Customer Registration
                </div>
                <div className="text-[11px] text-base-content/60">
                  Allow visitors to self-register via the storefront auth screens.
                </div>
              </div>
              <form.Field name="enablePublicSignup">
                {(field) => (
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="toggle toggle-neutral toggle-sm"
                    aria-label="Toggle public customer registration"
                  />
                )}
              </form.Field>
            </div>

            <div className="flex justify-end pt-4 border-t border-base-200">
              <button
                type="submit"
                className="btn btn-neutral btn-sm gap-2 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
