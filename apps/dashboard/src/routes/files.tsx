import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { useRef, useState } from "react";
import { adminOnly } from "#/lib/auth";
import {
  Empty,
  ManPage,
  Section,
  formatBytes,
  stamp,
  tableClass,
  tdClass,
  thClass,
  wideOnly,
} from "#/components/Man";

export const fetchFiles = createServerFn({ method: "GET" })
  .middleware([adminOnly])
  .handler(async () => {
    // `include` is honored at runtime (compat date ≥ 2022-08-04) but missing from the base types.
    const list = await env.STORAGE.list({ limit: 500, include: ["httpMetadata"] } as R2ListOptions);
    return {
      truncated: list.truncated,
      objects: list.objects.map((o) => ({
        key: o.key,
        size: o.size,
        uploaded: o.uploaded.toISOString(),
        contentType: o.httpMetadata?.contentType ?? "",
      })),
    };
  });

export const uploadFile = createServerFn({ method: "POST" })
  .middleware([adminOnly])
  .validator((data: FormData) => {
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0) throw new Error("Choose a file to upload.");
    return file;
  })
  .handler(async ({ data: file }) => {
    const key = `uploads/${file.name}`;
    // Never overwrite silently: an existing key is an error, not a replace.
    if (await env.STORAGE.head(key))
      throw new Error(`${key} already exists. Rename the file first.`);
    await env.STORAGE.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    return key;
  });

export const Route = createFileRoute("/files")({
  loader: () => fetchFiles(),
  component: FilesPage,
});

function FilesPage() {
  const { objects, truncated } = Route.useLoaderData();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "ok" | "error"; text?: string }>({
    kind: "idle",
  });
  const [copied, setCopied] = useState<string | null>(null);
  const total = objects.reduce((sum, o) => sum + o.size, 0);

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "busy" });
    try {
      const key = await uploadFile({ data: new FormData(e.currentTarget) });
      if (input.current) input.current.value = "";
      setStatus({ kind: "ok", text: `Uploaded ${key}.` });
      await router.invalidate();
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Upload failed." });
    }
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 2000);
  };

  return (
    <ManPage
      name="files"
      summary="Objects in the R2 bucket bound as env.STORAGE. Uploads go under uploads/."
      synopsis={
        <>
          loader → fetchFiles() → STORAGE.list() · {objects.length}
          {truncated ? "+" : ""} objects · {formatBytes(total)}
        </>
      }
    >
      <Section title="Upload" id="upload">
        <form onSubmit={upload} className="flex flex-wrap items-center gap-3">
          <label className="min-w-0">
            <span className="sr-only">File to upload</span>
            <input
              ref={input}
              type="file"
              name="file"
              required
              className="font-mono text-[13px] text-muted file:mr-3 file:px-2 file:min-h-8 file:border file:border-base-content file:bg-transparent file:font-mono file:text-[13px] file:text-base-content file:cursor-pointer hover:file:bg-base-content hover:file:text-base-100 file:transition-colors"
            />
          </label>
          <button type="submit" className="ctl ctl-primary" disabled={status.kind === "busy"}>
            {status.kind === "busy" ? "uploading…" : "upload"}
          </button>
          <span
            role="status"
            className={`font-mono text-xs ${status.kind === "error" ? "text-error" : "text-muted"}`}
          >
            {status.text}
          </span>
        </form>
      </Section>

      <Section title="Objects" id="objects">
        {objects.length === 0 ? (
          <Empty>The bucket is empty. Upload a file and it appears here.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={thClass}>
                    Key
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly}`}>
                    Type
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly} text-right`}>
                    Size
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly} text-right`}>
                    Uploaded (UTC)
                  </th>
                  <th scope="col" className={`${thClass} pr-0`}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {objects.map((o) => (
                  <tr
                    key={o.key}
                    className="hover:bg-base-200/60 transition-colors duration-(--dur)"
                  >
                    <td className={tdClass}>
                      <span className="[overflow-wrap:anywhere]">{o.key}</span>
                      <span className="block sm:hidden text-muted">
                        {o.contentType || "n/a"} · {formatBytes(o.size)} · {stamp(o.uploaded)}
                      </span>
                    </td>
                    <td className={`${tdClass} ${wideOnly} text-muted`}>
                      {o.contentType || "n/a"}
                    </td>
                    <td className={`${tdClass} ${wideOnly} text-right whitespace-nowrap`}>
                      {formatBytes(o.size)}
                    </td>
                    <td
                      className={`${tdClass} ${wideOnly} text-right text-muted whitespace-nowrap`}
                    >
                      {stamp(o.uploaded)}
                    </td>
                    <td className="py-1 text-right">
                      <button
                        type="button"
                        className="ctl"
                        onClick={() => copyKey(o.key)}
                        aria-label={`Copy key ${o.key}`}
                      >
                        {copied === o.key ? "copied" : "copy key"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </ManPage>
  );
}
