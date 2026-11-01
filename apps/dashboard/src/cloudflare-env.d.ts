declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    STORAGE: R2Bucket;
    KV: KVNamespace;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    AUTH_COOKIE_DOMAIN?: string;
    RESEND_API_KEY?: string;
    ENVIRONMENT?: string;
    APP_NAME?: string;
  }
}
