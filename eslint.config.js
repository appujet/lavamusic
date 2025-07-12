import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import turbo from "eslint-plugin-turbo";
import "eslint-plugin-only-warn";
import globals from "globals";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,

  {
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...react.configs.flat.recommended.languageOptions?.globals,
        ...globals.serviceworker,
      },
    },
  },

  {
    plugins: { "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
  },

  {
    plugins: { "@next/next": next },
    rules: {
      ...next.configs["core-web-vitals"].rules,
    },
  },

  {
    plugins: { turbo },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },

  { ignores: ["dist/"] },
];
