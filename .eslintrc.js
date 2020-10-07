/* eslint-env node */

// @ts-check

/** @type {import("./packages/config-files/types").ESLintConfig} */
const config = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
    plugins: ["react-hooks"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", {accessibility: "no-public"}],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "no-duplicate-imports": ["error"],
        "no-useless-computed-key": ["error"],
        "no-useless-rename": ["error"],
        "no-var": ["error"],
        "object-shorthand": "error",
        "prefer-const": ["error"],
        "react-hooks/exhaustive-deps": ["error"],
        "react-hooks/rules-of-hooks": ["error"],
    },
    overrides: [
        {
            files: ["**/.*rc.js", "**/*.config.js", "./packages/config-files/**/*.js"],
            env: {
                commonjs: true,
                node: true,
            },
        },
        {
            files: ["./packages/eslint-plugin/**/*.ts"],
            rules: {
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
            },
        },
        {
            files: ["./packages/util/**/*.ts", "./packages/util/**/*.tsx"],
            rules: {
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
            },
        },
        {
            files: ["./packages/util/src/browser/**/*.ts"],
            env: {
                browser: true,
            },
        },
        {
            files: ["./packages/web-ui/**/*.ts", "./packages/web-ui/**/*.tsx"],
            rules: {
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
            },
        },
    ],
};

module.exports = config;
