---
version: 1
slug: "apps-dashboard-src-routes-index-tsx"
primary_target: "apps/dashboard/src/routes/index.tsx"
related_targets:
  [
    "apps/dashboard/src/components/DashboardLayout.tsx",
    "apps/dashboard/src/routes/users.tsx",
    "apps/dashboard/src/routes/files.tsx",
    "apps/dashboard/src/routes/settings.tsx",
    "apps/dashboard/src/routes/guide.tsx",
    "apps/dashboard/src/routes/login.tsx",
  ]
---

# Admin console (apps/dashboard)

Scope: every dashboard route (overview, users, files, settings, guide, login) plus the shell. Visitor mode: Operate.
Audience and job: the template owner (solo dev) checks binding health, finds a user, copies an R2 link, adjusts settings, leaves.
Constraints: DaisyUI 5, single light theme, no React Query, rebrand via tokens (name, mark, accent). Sample data must be labelled.

## Direction contract

THESIS: The console is a man page for the running product. It refuses the SaaS admin default of a gray sidebar, a KPI card row, and rounded cards; content is set as a document with sections, synopsis, and aligned columns.

OWN-WORLD: White paper, near-black ink, one reserved accent (rebrandable, default #0b57d0) used only for the current page, links, focus, and live state. A monospace face for data, labels, and section heads; a grotesk for prose. Hairline rules instead of cards, zero radius, bracketed text controls `[ Refresh ]`, man-style section numbers in the nav: overview(1), users(5), files(7), settings(8), guide(9).

STORY: The owner sees at once what the product is, whether every binding answers, and what happened recently, then jumps to a section by its number.

FIRST VIEWPORT: A running header (`PRODUCT(1)  Admin Console  PRODUCT(1)`) over a left index column of numbered sections. Main column: NAME and SYNOPSIS lines, then STATUS as a ruled two-column list of bindings (D1, R2, KV, Auth) with live dots and right-aligned figures on dotted leaders, then EVENTS as an aligned log. The primary action, `[ Refresh ]`, sits at the right of the running header.

FORM: Unix man page / RFC document, candidate 4 of 7, seed key 580588f3. Raises: catalog numbers on every section (Saville), accent reserved for the active item (orienteering), two inks plus accent (Ikeda), right-aligned figures with leaders (j-card), focused row expands inline (streaming wall), one 160ms motion constant (garden map).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
