import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

const root = "../..";

export default defineConfig(({ command, mode }) => {
  // Root .env (gitignored, or CI env vars) holds the real Cloudflare IDs.
  const env = loadEnv(mode, root, "");

  return {
    envDir: root,
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      cloudflare({
        viteEnvironment: { name: "ssr" },
        // Off by default: a fixed port collides with the other app and editor tooling.
        // Set a free port (e.g. 9229) here when you need the worker debugger.
        inspectorPort: false,
        // One local D1/KV/R2 shared by both apps and `pnpm db:migrate:local`.
        persistState: { path: `${root}/.wrangler/state` },
        // IDs go into the build output only (dist/, gitignored), never into wrangler.jsonc.
        config: (worker) => {
          if (command !== "build") return;
          const [d1] = worker.d1_databases;
          const [kv] = worker.kv_namespaces;
          const [r2] = worker.r2_buckets;
          if (d1 && env.D1_DATABASE_ID) d1.database_id = env.D1_DATABASE_ID;
          if (kv && env.KV_NAMESPACE_ID) kv.id = env.KV_NAMESPACE_ID;
          if (r2 && env.R2_BUCKET_NAME) r2.bucket_name = env.R2_BUCKET_NAME;
        },
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  };
});
