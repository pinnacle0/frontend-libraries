// @ts-check
import eslint from "@eslint/js";
import tsESlint from "typescript-eslint";
import globals from "globals";

export default tsESlint.config(
    {
        files: ["**/*.ts", "**/*.js"],
        // @ts-ignore
        extends: [eslint.configs.recommended, ...tsESlint.configs.recommended],
        languageOptions: {
            parser: tsESlint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2015,
            },
        },
        rules: {
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/explicit-member-accessibility": ["error", {accessibility: "no-public"}],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-require-imports": "off",
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
    },
    {
        files: ["**/.*rc.js", "**/*.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
        languageOptions: {
            globals: {
                ...globals.commonjs,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/tools/index.js"],
        rules: {
            "import/no-dynamic-require": "off",
        },
    },
    {
        ignores: ["**/build/**/*", "**/dist/**/*", "**/node_modules/**/*"],
    }
);
