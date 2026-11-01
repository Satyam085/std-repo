// Rebrand here (or via VITE_* vars in the root .env).
export const APP_NAME: string = import.meta.env.VITE_APP_NAME ?? "Template";
export const STOREFRONT_URL: string =
  import.meta.env.VITE_STOREFRONT_URL ?? "http://localhost:3000";
