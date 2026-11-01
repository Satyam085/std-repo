import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Save, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const form = useForm({
    defaultValues: {
      siteName: "My Production App",
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
        <h1 className="text-2xl font-black tracking-tight">System Settings</h1>
        <p className="text-sm text-base-content/70 mt-1">
          Configure runtime variables, Cloudflare KV rate limiting thresholds, and defaults.
        </p>
      </div>

      {saved && (
        <div className="alert alert-success shadow-sm">
          <Check className="w-5 h-5" />
          <span className="text-sm font-semibold">Settings updated successfully!</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <form.Field name="siteName">
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Application Title</span>
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="input input-bordered w-full input-sm"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <form.Field name="supportEmail">
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Support Contact Email</span>
                      </label>
                      <input
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="input input-bordered w-full input-sm"
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <form.Field name="rateLimitMax">
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">KV Rate Limit (Requests)</span>
                      </label>
                      <input
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="input input-bordered w-full input-sm"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Max requests per sliding window
                        </span>
                      </label>
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <form.Field name="rateLimitWindow">
                  {(field) => (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Window Interval (Seconds)</span>
                      </label>
                      <input
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="input input-bordered w-full input-sm"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Sliding window TTL
                        </span>
                      </label>
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="divider"></div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Public Registration</div>
                <div className="text-xs text-base-content/60">
                  Allow new users to create accounts via Storefront
                </div>
              </div>
              <form.Field name="enablePublicSignup">
                {(field) => (
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="toggle toggle-primary"
                  />
                )}
              </form.Field>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary btn-sm gap-2">
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
