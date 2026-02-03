import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules",
      "**/dist",
      "**/coverage",
      "**/reports",
      "**/*.d.ts",
      "**/*.test.ts",
      "**/*.config.ts",
      "**/*.config.cjs",
    ],
  },
  {
    plugins: { js, prettier },
    extends: ["js/recommended"],
    rules: {
      "prettier/prettier": "error",
      "no-return-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["packages/server/**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./packages/server/tsconfig.json",
      },
    },
  },
  {
    files: ["packages/ui/**/*.ts"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: "./packages/ui/tsconfig.json",
      },
    },
  },
  {
    files: ["packages/shared/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./packages/shared/tsconfig.json",
      },
    },
  },
  ...tseslint.configs.recommended,
]);
