import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HardDrive, Upload, Copy, Check, FileText, Image, FileArchive, Globe } from "lucide-react";
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
          <h1 className="text-xl font-bold tracking-tight">Cloudflare R2 Storage</h1>
          <p className="text-xs text-base-content/70 mt-1">
            Zero-egress object storage connected via Worker binding <code>env.STORAGE</code>.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-neutral btn-sm gap-2 text-xs font-semibold shadow-sm cursor-pointer"
          onClick={() => alert("Direct streaming upload to R2 via presigned Worker URL.")}
        >
          <Upload className="w-4 h-4" />
          Upload Object
        </button>
      </div>

      {/* Bucket Info Banner */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-base-200 text-base-content rounded-lg">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-base-content">prod-storage</span>
              <span className="text-base-content/50 ml-2">Bucket attached to Workers</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-base-content/70">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-success" />
              Global Replication
            </span>
            <span className="badge badge-success badge-outline badge-sm text-[10px] font-bold">
              0.00 Egress Fee
            </span>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-xs" aria-label="Stored objects list">
              <thead>
                <tr className="border-b border-base-200 text-base-content/50 uppercase text-[10px] tracking-wider">
                  <th scope="col" className="py-2.5">
                    File Name
                  </th>
                  <th scope="col" className="py-2.5">
                    Content Type
                  </th>
                  <th scope="col" className="py-2.5">
                    Size
                  </th>
                  <th scope="col" className="py-2.5">
                    Uploaded
                  </th>
                  <th scope="col" className="py-2.5 text-right">
                    Direct Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {fileList.map((file) => {
                  const isImg = file.contentType.startsWith("image/");
                  const isPdf = file.contentType.includes("pdf");
                  return (
                    <tr key={file.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5 font-medium text-base-content">
                          {isImg ? (
                            <Image className="w-4 h-4 text-info" />
                          ) : isPdf ? (
                            <FileText className="w-4 h-4 text-warning" />
                          ) : (
                            <FileArchive className="w-4 h-4 text-accent" />
                          )}
                          <span>{file.filename}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge badge-sm badge-ghost text-[10px] font-medium">
                          {file.contentType}
                        </span>
                      </td>
                      <td className="text-base-content/80 text-xs tabular-nums py-3">
                        {formatBytes(file.size)}
                      </td>
                      <td className="text-base-content/60 text-xs tabular-nums py-3">
                        {file.uploadedAt}
                      </td>
                      <td className="text-right py-3">
                        <button
                          type="button"
                          onClick={() => copyUrl(file.key)}
                          className="btn btn-ghost btn-xs gap-1.5 text-xs"
                          aria-label={`Copy link for ${file.filename}`}
                        >
                          {copiedKey === file.key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-success" />
                              <span className="text-success font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-base-content/60" />
                              <span className="text-base-content/75">Copy URL</span>
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
