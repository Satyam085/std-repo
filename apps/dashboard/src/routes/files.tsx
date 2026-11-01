import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HardDrive, Upload, Copy, Check, FileText, Image, FileArchive } from "lucide-react";
import { useState } from "react";

interface FileItem {
  id: string;
  key: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

const SAMPLE_FILES: FileItem[] = [
  {
    id: "f-1",
    key: "uploads/2026/product-hero.webp",
    filename: "product-hero.webp",
    contentType: "image/webp",
    size: 245000,
    uploadedAt: "2026-10-30",
  },
  {
    id: "f-2",
    key: "documents/terms-v2.pdf",
    filename: "terms-v2.pdf",
    contentType: "application/pdf",
    size: 1420000,
    uploadedAt: "2026-10-25",
  },
  {
    id: "f-3",
    key: "backups/export-20261024.zip",
    filename: "export-20261024.zip",
    contentType: "application/zip",
    size: 8900000,
    uploadedAt: "2026-10-24",
  },
];

export const fetchFilesServer = createServerFn({ method: "GET" }).handler(async () => {
  return SAMPLE_FILES;
});

export const Route = createFileRoute("/files")({
  loader: async () => {
    return await fetchFilesServer();
  },
  component: FilesPage,
});

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function FilesPage() {
  const fileList = Route.useLoaderData();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyUrl = (key: string) => {
    navigator.clipboard.writeText(`https://r2.yourdomain.com/${key}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Cloudflare R2 Object Storage</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Zero-egress file storage attached via Worker binding <code>env.STORAGE</code>.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={() => alert("Direct R2 streaming upload configured via API.")}
        >
          <Upload className="w-4 h-4" />
          Upload to R2
        </button>
      </div>

      {/* Bucket Info */}
      <div className="alert bg-base-100 border border-base-300 shadow-sm">
        <HardDrive className="w-5 h-5 text-accent" />
        <div>
          <h3 className="font-bold text-sm">Binding Status: Active</h3>
          <div className="text-xs text-base-content/70">
            Bucket: <code>prod-storage</code> • Region: Automated (Global Edge) • Egress Fee: $0.00
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Content Type</th>
                  <th>File Size</th>
                  <th>Uploaded Date</th>
                  <th className="text-right">Public Link</th>
                </tr>
              </thead>
              <tbody>
                {fileList.map((file) => {
                  const isImg = file.contentType.startsWith("image/");
                  const isPdf = file.contentType.includes("pdf");
                  return (
                    <tr key={file.id}>
                      <td>
                        <div className="flex items-center gap-2.5 font-medium">
                          {isImg ? (
                            <Image className="w-4 h-4 text-primary" />
                          ) : isPdf ? (
                            <FileText className="w-4 h-4 text-warning" />
                          ) : (
                            <FileArchive className="w-4 h-4 text-secondary" />
                          )}
                          <span>{file.filename}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-ghost text-xs">
                          {file.contentType}
                        </span>
                      </td>
                      <td className="text-base-content/80 text-xs font-mono">
                        {formatBytes(file.size)}
                      </td>
                      <td className="text-base-content/60 text-xs">{file.uploadedAt}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => copyUrl(file.key)}
                          className="btn btn-ghost btn-xs gap-1"
                        >
                          {copiedKey === file.key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-success" />
                              <span className="text-success text-xs">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-xs">Copy URL</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
