import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginImport from "eslint-plugin-import";
import globals from "globals";

const myGlobals = {
  ...globals.browser,

  _: false,
  createjs: false,
};
delete myGlobals.Animation;

export default defineConfig([
  globalIgnores([
    ///
    "./lib/*",
    "./build",
    "./tsconfig.json",
    "./package-lock.json",
    "./package.json",
  ]),
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: myGlobals },
    plugins: { import: eslintPluginImport },
    rules: {
      "no-unused-vars": "off",
      "no-var": "error",
      "prefer-const": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          pathGroupOverrides: [
            {
              pattern: "@/**",
              action: "enforce",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          named: true,
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
]);
