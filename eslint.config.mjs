import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import eslintPluginImport from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";

const myGlobals = {
  ...globals.browser,

  _: false,
  createjs: false,
  Graphics: true,
};
delete myGlobals.Animation;

export default defineConfig([
  globalIgnores([
    ///
    "./common/lib",
    "./build",
    "**/Spec-*",
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
