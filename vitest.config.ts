import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  test: {
    environment: "jsdom",
    globals: true,

    setupFiles: ["./tests/setup.ts"],

    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
    ],

    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html",
        "json-summary",
      ],

      include: [
        "app/**/*.{ts,tsx}",
        "middleware.ts",
      ],

      exclude: [
        "app/**/layout.tsx",
        "app/globals.css",
        "app/favicon.ico",
      ],
    },
  },
})