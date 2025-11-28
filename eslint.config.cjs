// eslint.config.cjs
const js = require("@eslint/js");
const pluginVue = require("eslint-plugin-vue");
const globals = require("globals");

module.exports = [
    // Diese Dateien komplett ignorieren
    {
        ignores: ["eslint.config.cjs"],
    },

    // Basis-JavaScript-Regeln
    js.configs.recommended,

    // Vue 3 Flat-Config (vom Plugin)
    ...pluginVue.configs["flat/recommended"],

    // Dein eigenes Projekt-Setup
    {
        files: ["**/*.{js,jsx,vue}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "vue/multi-word-component-names": "off",
            // weitere Regeln …
        },
    },
];
