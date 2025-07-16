import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";

const myGlobals = {
  _: false,
  createjs: false,
  Balance: true,
  EaselJSGraphics: true,
  EaselJSTimer: true,
  Graphics: true,
  Smart: true,
  XQuestGame: true,
  XQuestInput: true,
};

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
    languageOptions: { globals: { ...globals.browser, ...myGlobals } },
    rules: {
      "no-unused-vars": "off",
      "no-var": "error",
      "prefer-const": "error",
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
