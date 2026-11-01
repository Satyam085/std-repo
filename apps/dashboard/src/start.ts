import { createStart } from "@tanstack/react-start";

// SPA mode: only the HTML shell is server-rendered; loaders and beforeLoad run in the browser.
export const startInstance = createStart(() => ({ defaultSsr: false }));
