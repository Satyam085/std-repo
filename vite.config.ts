import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    ignorePatterns: [
      "**/dist/**",
      "**/.output/**",
      "**/.wrangler/**",
      "**/.vinxi/**",
      "**/node_modules/**",
      "**/routeTree.gen.ts",
    ],
    options: {
      typeCheck: false,
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  fmt: {
    ignorePatterns: [
      "**/dist/**",
      "**/.output/**",
      "**/.wrangler/**",
      "**/.vinxi/**",
      "**/node_modules/**",
      "**/routeTree.gen.ts",
      "pnpm-lock.yaml",
    ],
  },
});
