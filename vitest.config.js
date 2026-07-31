import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/**/.generated/**"],
      include: ["src/**/*.js"],
      provider: "istanbul",
      reporter: ["text-summary", "html"],
      reportsDirectory: "test/test-coverage",
      thresholds: {
        branches: 65,
        functions: 50,
        lines: 80,
        statements: 80,
      },
    },
    environment: "node",
    globals: true,
    include: ["test/**/*.test.js"],
    silent: true,
    testTimeout: 30_000,
  },
});
