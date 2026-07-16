import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.js"],
    testTimeout: 30_000,
    silent: true,
    coverage: {
      provider: "istanbul",
      reporter: ["text-summary", "html"],
      reportsDirectory: "test/test-coverage",
      include: ["src/**/*.js"],
      exclude: ["src/**/.generated/**"],
      thresholds: {
        branches: 65,
        functions: 50,
        lines: 80,
        statements: 80,
      },
    },
  },
});
