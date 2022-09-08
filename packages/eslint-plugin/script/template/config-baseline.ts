// -----------------------------------------------------------------------------
//      Attention: This file is generated by "codegen" script
//                           Do not modify by hand
//              Run "codegen" script to regenerate this file
// -----------------------------------------------------------------------------

import type * as ESLint from "eslint";
// @ts-expect-error -- untyped module
import confusingBrowserGlobals from "confusing-browser-globals";

export const baseline: ESLint.Linter.Config = {
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended", "plugin:import/typescript", "prettier"],
    plugins: ["@pinnacle0", "@typescript-eslint", "eslint-comments", "import", "react", "react-hooks"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {jsx: true},
    },
    settings: {
        react: {version: "detect"},
    },
    rules: {
        // {{TEMPLATE_RULE_DEFINITIONS}}

        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
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
        "@typescript-eslint/member-ordering": [
            "error",
            {
                default: {
                    memberTypes: [
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "public-abstract-field",
                        "protected-abstract-field",
                        "private-abstract-field",
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                        "public-abstract-method",
                        "protected-abstract-method",
                        "private-abstract-method",
                    ],
                    order: "as-written",
                },
            },
        ],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": ["error"],
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",

        "eslint-comments/no-unlimited-disable": ["error"],
        "eslint-comments/require-description": [
            "error",
            {
                ignore: ["eslint-enable", "eslint-env", "exported", "global", "globals"],
            },
        ],

        "import/first": ["error"],
        "import/newline-after-import": ["error"],
        "import/no-anonymous-default-export": [
            "error",
            {
                allowArray: false,
                allowArrowFunction: false,
                allowAnonymousClass: false,
                allowAnonymousFunction: false,
                allowCallExpression: true,
                allowLiteral: false,
                allowObject: true,
            },
        ],
        "import/no-default-export": ["error"],
        "import/no-duplicates": ["error"],
        "import/no-dynamic-require": ["error"],
        "import/no-useless-path-segments": ["error", {noUselessIndex: false}],
        "import/prefer-default-export": "off",

        eqeqeq: ["error", "always", {null: "ignore"}],
        "no-console": ["error", {allow: ["info", "warn", "error"]}],
        "no-duplicate-imports": "off", // Use rule from eslint-plugin-import
        "no-restricted-globals": ["error", ...confusingBrowserGlobals],
        // no `this` and `super` in static method
        "no-restricted-syntax": [
            "error",
            {
                selector: "ClassDeclaration MethodDefinition[static='true'] ThisExpression",
                message: "`this` keyword is not allowed in static methods of class",
            },
            {
                selector: "ClassDeclaration MethodDefinition[static='true'] Super",
                message: "`super` keyword is not allowed in static methods of class",
            },
        ],
        "no-useless-computed-key": ["error"],
        "no-useless-rename": ["error"],
        "no-var": ["error"],
        "object-shorthand": ["error"],
        "prefer-const": ["error"],
        "require-yield": "off",
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
