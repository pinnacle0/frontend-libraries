import type {TSESLint} from "@typescript-eslint/experimental-utils";

export function createConfig({parserOptions}: Omit<TSESLint.RuleTesterConfig, "parser"> = {}): TSESLint.RuleTesterConfig {
    return {
        parser: require.resolve("@typescript-eslint/parser"),
        parserOptions: {
            sourceType: "module",
            ecmaVersion: 2019,
            ecmaFeatures: {
                jsx: true,
            },
            ...parserOptions,
        },
    };
}
