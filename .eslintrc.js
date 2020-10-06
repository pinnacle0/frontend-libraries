/* eslint-env node */

// @ts-check

/** @type {import("./packages/config-files/types").ESLintConfig} */
const config = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
            files: ["./.*rc.js", "./*.config.js", "./packages/config-files/**/*.js"],
            env: {
                commonjs: true,
                node: true,
            },
        },
    ],
};

module.exports = config;
