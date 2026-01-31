import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    reporters: ["default", "junit"],
    outputFile: "reports/junit.xml",
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["html", "lcov"],
      reportsDirectory: "reports/coverage",
    },
  },
});
