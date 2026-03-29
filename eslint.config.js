import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";


export default [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
        globals: globals.browser,
        parser: tsParser,
        parserOptions: {
            sourceType: "module",
            ecmaVersion: "latest"
        }
        },
        plugins: {
        "@typescript-eslint": tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "no-unused-vars": "error",
            "no-undef": "error",
            // вот это
            "sort-vars": "error"
        }
    }
];