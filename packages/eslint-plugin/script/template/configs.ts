// -----------------------------------------------------------------------------
//      Attention: This file is generated by "codegen" script
//                           Do not modify by hand
//              Run "codegen" script to regenerate this file
// -----------------------------------------------------------------------------

import eslint from "@eslint/js";
import tsESlint from "typescript-eslint";
import globals from "globals";
// @ts-expect-error -- untyped module
import confusingBrowserGlobals from "confusing-browser-globals";
import eslintPluginPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";
// @ts-expect-error -- untyped module
import eslintPluginComments from "eslint-plugin-eslint-comments";
import eslintPluginVitest from "@vitest/eslint-plugin";
import {FlatCompat} from "@eslint/eslintrc";
import {fixupPluginRules} from "@eslint/compat";
import type {TSESLint} from "@typescript-eslint/utils";

// TODO/David: remove after all legacy plugin updated
// ref: https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: eslint.configs.recommended,
});

function legacyPlugin(name: string, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias];

    if (!plugin) {
        throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
    }

    return fixupPluginRules(plugin);
}

export const baseline = (plugin: TSESLint.FlatConfig.Plugin) =>
    tsESlint.config({
        extends: [eslint.configs.recommended, tsESlint.configs.eslintRecommended, ...tsESlint.configs.recommended, eslintPluginPrettier, ...compat.extends("plugin:import/typescript")],
        plugins: {
            import: legacyPlugin("eslint-plugin-import", "import"),
            "@typescript-eslint": tsESlint.plugin,
            "@pinnacle0": plugin,
            react: eslintPluginReact,
            "react-hooks": eslintPluginReactHooks,
            "eslint-comments": eslintPluginComments,
        },
        languageOptions: {
            parser: tsESlint.parser as any,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {jsx: true},
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2015,
            },
        },
        settings: {
            react: {version: "detect"},
        },
        rules: {
            // {{TEMPLATE_RULE_DEFINITIONS}}
    
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-expressions": "off",
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
                    fixStyle: "inline-type-imports",
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
                            "public-constructor",
                            "protected-constructor",
                            "private-constructor",
                            "public-instance-method",
                            "protected-instance-method",
                            "private-instance-method",
                            "public-abstract-method",
                            "protected-abstract-method",
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
            "no-constant-condition": ["error", {checkLoops: false}],
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
    });

export const vitest = tsESlint.config({
    plugins: {
        vitest: eslintPluginVitest,
        "testing-library": eslintPluginTestingLibrary,
    },
    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
    rules: {
        // vitest
        "vitest/consistent-test-it": ["warn", {fn: "test", withinDescribe: "test"}],
        "vitest/expect-expect": "off", // This is too annoying
        "vitest/no-alias-methods": ["warn"],
        "vitest/no-commented-out-tests": ["warn"],
        "vitest/no-duplicate-hooks": ["warn"],
        "vitest/no-identical-title": ["warn"],
        "vitest/no-mocks-import": ["warn"],
        "vitest/no-restricted-matchers": [
            "warn",
            {
                resolves: "Use `expect(await promise)` instead.",
            },
        ],
        "vitest/no-standalone-expect": ["warn"],
        "vitest/no-test-prefixes": ["warn"],
        "vitest/no-test-return-statement": ["warn"],
        "vitest/prefer-called-with": ["warn"],
        "vitest/prefer-expect-assertions": "off", // This is too annoying
        "vitest/prefer-hooks-on-top": ["warn"],
        "vitest/prefer-spy-on": ["warn"],
        "vitest/prefer-strict-equal": ["warn"],
        "vitest/prefer-lowercase-title": ["warn", {ignore: ["describe"]}],
        "vitest/prefer-to-be": ["warn"],
        "vitest/prefer-to-contain": ["warn"],
        "vitest/prefer-to-have-length": ["warn"],
        "vitest/prefer-todo": ["warn"],
        "vitest/require-top-level-describe": ["warn"],
        "vitest/valid-expect": ["warn"],
        "vitest/valid-title": "off", // This is too annoying

        // testing-library
        "testing-library/await-async-queries": ["warn"],
        "testing-library/await-async-utils": ["warn"],
        "testing-library/no-await-sync-queries": ["warn"],
        "testing-library/no-dom-import": ["warn", "react"],
        "testing-library/no-render-in-lifecycle": ["warn"],
        "testing-library/prefer-find-by": ["warn"],
        "testing-library/prefer-presence-queries": ["warn"],
        "testing-library/prefer-screen-queries": ["warn"],
    },
});