import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/coverage",
      "**/reports",
      "**/*.d.ts",
      "**/*.test.ts",
      "**/*.config.*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-unused-vars": "off", // Disable JS to use TS rule below:
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["packages/server/**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ["./packages/server/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ["./packages/ui/tsconfig.app.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["packages/shared/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["./packages/shared/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
]);
