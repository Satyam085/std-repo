import type { ReactNode } from "react";

// Every dashboard page is set as a man page: NAME, optional SYNOPSIS, then sections.
export function ManPage({
  name,
  summary,
  synopsis,
  actions,
  children,
}: {
  name: string;
  summary: string;
  synopsis?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="max-w-6xl divide-y divide-base-300">
      <Section title="Name" className="pb-7">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-balance">{name}</h1>
            <p className="mt-1.5 text-muted text-pretty max-w-[65ch]">{summary}</p>
          </div>
          {actions && <div className="flex flex-wrap gap-1 -mx-2">{actions}</div>}
        </div>
      </Section>
      {synopsis && (
        <Section title="Synopsis">
          <p className="font-mono text-[13px] leading-6 text-muted">{synopsis}</p>
        </Section>
      )}
      {children}
    </article>
  );
}

export function Section({
  title,
  id,
  className = "py-7",
  children,
}: {
  title: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`${className} md:grid md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8`}
    >
      <h2 id={id} className="man-h mb-3 md:mb-0 md:pt-1">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

// label ........................ value
export function Leader({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 font-mono text-[13px] leading-7">
      <span className="shrink-0">{label}</span>
      <span
        aria-hidden
        className="flex-1 min-w-4 -translate-y-1 border-b border-dotted border-base-content/35"
      />
      <span className="min-w-0 text-right tabular-nums [overflow-wrap:anywhere]">{children}</span>
    </div>
  );
}

export function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2 rounded-full ${ok ? "bg-primary" : "bg-error"}`}
    />
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[13px] text-muted py-2">{children}</p>;
}

// Shared mono table: hairline rows, uppercase muted head.
export const tableClass = "w-full font-mono text-[13px] text-left";
export const thClass =
  "man-h text-[11px] text-muted font-medium py-2 pr-6 border-b border-base-content";
export const tdClass = "py-2.5 pr-6 align-top";
// Secondary columns: shown from sm up; below that their values fold under the first cell.
export const wideOnly = "hidden sm:table-cell";

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${parseFloat((bytes / 1024 ** i).toFixed(1))} ${units[i]}`;
}

// 2026-11-01 14:02 (UTC)
export const stamp = (d: Date | string) => new Date(d).toISOString().slice(0, 16).replace("T", " ");
