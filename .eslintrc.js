// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/typescript", "prettier"],
    plugins: ["import", "react", "react-hooks"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {jsx: true},
    },
    settings: {
        react: {version: "detect"},
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "allow",
            },
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                disallowTypeAnnotations: false,
            },
        ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", {accessibility: "no-public"}],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",

        "import/first": ["error"],
        "import/no-duplicates": ["error"],

        eqeqeq: ["error", "always", {null: "ignore"}],
        "no-console": ["error", {allow: ["info", "warn", "error"]}],
        "no-duplicate-imports": "off",
        "no-useless-computed-key": ["error"],
        "no-useless-rename": ["error"],
        "no-var": ["error"],
        "object-shorthand": ["error"],
        "prefer-const": ["error"],
        "spaced-comment": [
            "error",
            "always",
            {
                line: {
                    markers: ["/"],
                },
                block: {
                    balanced: true,
                },
            },
        ],

        "react/display-name": "off",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-curly-brace-presence": ["error", {props: "never", children: "ignore"}],
        "react/jsx-fragments": ["error", "element"],
        "react/jsx-no-target-blank": "off",
        "react/self-closing-comp": ["error", {component: true, html: true}],

        "react-hooks/exhaustive-deps": ["error"],
        "react-hooks/rules-of-hooks": ["error"],
    },
};

module.exports = config;
