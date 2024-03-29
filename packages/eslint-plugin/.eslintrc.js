// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
    root: true, // Set root=true to prevent eslint config cascading from workspace root eslint config file
    ignorePatterns: ["./build/**"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
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
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": ["error", {args: "none"}],
        "no-useless-computed-key": ["error"],
        "no-useless-rename": ["error"],
        "no-var": ["error"],
        "object-shorthand": "error",
        "prefer-const": ["error"],
        "no-restricted-imports": [
            "error",
            {
                name: "@typescript-eslint/typescript-estree",
                message: "Use `@typescript-eslint/experimental-utils` instead when building ESLint plugin",
            },
        ],
    },
    overrides: [
        {
            files: ["**/.*rc.js", "**/*.config.js"],
            env: {commonjs: true, node: true},
        },
        {
            files: ["**/tools/index.js"],
            rules: {
                "import/no-dynamic-require": "off",
            },
        },
    ],
};

module.exports = config;
