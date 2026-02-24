// @ts-check
import {fixupPluginRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslint from "@eslint/js";
import {defineConfig} from "eslint/config";
import tsESlint from "typescript-eslint";
import globals from "globals";

// ref: https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: eslint.configs.recommended,
});

function legacyPlugin(name, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias];

    if (!plugin) {
        throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
    }

    return fixupPluginRules(plugin);
}

export default defineConfig(
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            react: eslintPluginReact,
            // @ts-ignore
            "react-hooks": eslintPluginReactHooks,
            import: legacyPlugin("eslint-plugin-import", "import"),
        },
        // TODO/David: remove after all legacy plugin updated
        // @ts-ignore
        extends: [eslint.configs.recommended, ...tsESlint.configs.recommended, eslintPluginPrettier, ...compat.extends("plugin:import/typescript")],
        languageOptions: {
            parser: tsESlint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaVersion: "latest",
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
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unused-vars": ["error", {args: "none"}],
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
    },
    {
        ignores: ["**/build/**/*", "**/dist/**/*", "**/lib/**/*", "**/node_modules/**/*"],
    }
);
