// -----------------------------------------------------------------------------
//      Attention: This file is generated by "codegen" script
//                           Do not modify by hand
//              Run "codegen" script to regenerate this file
// -----------------------------------------------------------------------------

import eslint from "@eslint/js";
import tsESlint from "typescript-eslint";
import globals from "globals";
// @ts-expect-error -- untyped module
import eslintConfigPrettier from "eslint-config-prettier";
// @ts-expect-error -- untyped module
import confusingBrowserGlobals from "confusing-browser-globals";
// @ts-expect-error -- untyped module
import eslintPluginReact from "eslint-plugin-react";
// @ts-expect-error -- untyped module
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
// @ts-expect-error -- untyped module
import eslintPluginJest from "eslint-plugin-jest";
// @ts-expect-error -- untyped module
import eslintPluginJestDOM from "eslint-plugin-jest-dom";
// @ts-expect-error -- untyped module
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";
// @ts-expect-error -- untyped module
import eslintPluginComments from "eslint-plugin-eslint-comments";
// @ts-expect-error -- untyped module
import {FlatCompat} from "@eslint/eslintrc";
import {fixupPluginRules} from "@eslint/compat";
import {type ESLint} from "eslint";

// TODO/David: remove after all legacy plugin updated
// ref: https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended,
});

function legacyPlugin(name: string, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias];

    if (!plugin) {
        throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
    }

    return fixupPluginRules(plugin);
}

export const baseline = (plugin: ESLint.Plugin) =>
    tsESlint.config({
        extends: [eslint.configs.recommended, tsESlint.configs.eslintRecommended, ...tsESlint.configs.recommended, eslintConfigPrettier, ...compat.extends("plugin:import/typescript")],
        plugins: {
            import: legacyPlugin("eslint-plugin-import", "import"),
            "@typescript-eslint": tsESlint.plugin,
            "@pinnacle0": plugin,
            react: eslintPluginReact,
            "react-hooks": fixupPluginRules(eslintPluginReactHooks),
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

export const jest = tsESlint.config({
    plugins: {
        "jest": eslintPluginJest,
        "jest-dom": eslintPluginJestDOM,
        "testing-library": eslintPluginTestingLibrary,
    },
    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
    rules: {
        // jest
        "jest/consistent-test-it": ["warn", {fn: "test", withinDescribe: "test"}],
        "jest/expect-expect": "off", // This is too annoying
        "jest/no-alias-methods": ["warn"],
        "jest/no-commented-out-tests": ["warn"],
        "jest/no-deprecated-functions": ["warn"],
        "jest/no-duplicate-hooks": ["warn"],
        "jest/no-export": ["warn"],
        "jest/no-identical-title": ["warn"],
        "jest/no-jasmine-globals": ["warn"],
        "jest/no-mocks-import": ["warn"],
        "jest/no-restricted-matchers": [
            "warn",
            {
                resolves: "Use `expect(await promise)` instead.",
            },
        ],
        "jest/no-standalone-expect": ["warn"],
        "jest/no-test-prefixes": ["warn"],
        "jest/no-test-return-statement": ["warn"],
        "jest/prefer-called-with": ["warn"],
        "jest/prefer-expect-assertions": "off", // This is too annoying
        "jest/prefer-hooks-on-top": ["warn"],
        "jest/prefer-spy-on": ["warn"],
        "jest/prefer-strict-equal": ["warn"],
        "jest/prefer-lowercase-title": ["warn", {ignore: ["describe"]}],
        "jest/prefer-to-be": ["warn"],
        "jest/prefer-to-contain": ["warn"],
        "jest/prefer-to-have-length": ["warn"],
        "jest/prefer-todo": ["warn"],
        "jest/require-top-level-describe": ["warn"],
        "jest/valid-expect": ["warn"],
        "jest/valid-title": "off", // This is too annoying

        // jest-dom
        "jest-dom/prefer-checked": ["warn"],
        "jest-dom/prefer-empty": ["warn"],
        "jest-dom/prefer-enabled-disabled": ["warn"],
        "jest-dom/prefer-focus": ["warn"],
        "jest-dom/prefer-required": ["warn"],
        "jest-dom/prefer-to-have-attribute": ["warn"],
        "jest-dom/prefer-to-have-text-content": ["warn"],

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