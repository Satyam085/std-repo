import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const envPath = path.join(rootDir, ".env");
if (!fs.existsSync(envPath)) {
  console.log("ℹ️  No root .env file found. Reading from environment or skipping sync.");
}

const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

function getEnvValue(key, fallback = "") {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match && match[1] ? match[1].trim() : process.env[key] || fallback;
}

const d1Id = getEnvValue("D1_DATABASE_ID");
const kvId = getEnvValue("KV_NAMESPACE_ID");
const r2Name = getEnvValue("R2_BUCKET_NAME", "prod-storage");

if (!d1Id && !kvId) {
  console.log(
    "⚠️  No D1_DATABASE_ID or KV_NAMESPACE_ID found in .env. Skipping sync.\n   (For local dev, default placeholder IDs work automatically via Miniflare!)",
  );
  process.exit(0);
}

const targetFiles = [
  path.join(rootDir, "apps", "web", "wrangler.jsonc"),
  path.join(rootDir, "apps", "dashboard", "wrangler.jsonc"),
  path.join(rootDir, "packages", "db", "wrangler.jsonc"),
];

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");

  if (d1Id) {
    content = content.replace(/"database_id":\s*"[^"]*"/, `"database_id": "${d1Id}"`);
  }

  if (kvId) {
    content = content.replace(/("binding":\s*"KV",\s*"id":\s*)"[^"]*"/, `$1"${kvId}"`);
  }

  if (r2Name) {
    content = content.replace(/"bucket_name":\s*"[^"]*"/, `"bucket_name": "${r2Name}"`);
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Synced Cloudflare IDs to ${path.relative(rootDir, filePath)}`);
}

console.log(
  "🎉 Cloudflare Wrangler bindings are synchronized across apps/web, apps/dashboard, and packages/db.",
);
