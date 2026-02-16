import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

const reactRecommended = pluginReact.configs.flat.recommended;
const reactJsxRuntime = pluginReact.configs.flat["jsx-runtime"];
const nextCoreWebVitals = nextPlugin.configs["core-web-vitals"];

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "pnpm-lock.yaml",
      ".github/**",
      ".vscode/**",
      "linting.log",
      "docs/**",
      "bkp_docs/**",
      "*.md",
      "README.md",
      "src/styles/**",
      "src/app/**/*.css",
      "src/app/*.css",
      "scripts/**/*.js",
    ],
  },
  ...tseslint.configs.recommended,
  {
    ...reactRecommended,
    files: ["**/*.{jsx,tsx}"],
  },
  {
    ...reactJsxRuntime,
    files: ["**/*.{jsx,tsx}"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextCoreWebVitals.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.json", "**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
