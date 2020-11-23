// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
    extends: [require.resolve("./packages/eslint-plugin/dogfood/baseline")],
    overrides: [
        {
            files: ["**/.*rc.js", "**/*.config.js"],
            env: {commonjs: true, node: true},
            rules: {
                "@typescript-eslint/no-var-requires": "off",
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
            env: {browser: true},
        },
        {
            files: ["./packages/web-ui/**/*.ts", "./packages/web-ui/**/*.tsx"],
            rules: {
                "@pinnacle0/deep-nested-relative-imports": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
            },
        },
    ],
};

module.exports = config;
