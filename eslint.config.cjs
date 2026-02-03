const { defineConfig } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
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
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: [
          "./packages/shared/tsconfig.json",
          "./packages/server/tsconfig.json",
          "./packages/ui/tsconfig.json",
        ],

        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:prettier/recommended",
    ),

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

    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./packages/shared/tsconfig.json",
            "./packages/server/tsconfig.json",
            "./packages/ui/tsconfig.json",
          ],
        },
      },
    },
  },
]);
