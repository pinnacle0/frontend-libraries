import type {RuleTesterConfig} from "@typescript-eslint/experimental-utils/dist/ts-eslint";

export function createConfig({parserOptions}: Omit<RuleTesterConfig, "parser"> = {}): RuleTesterConfig {
    return {
        parser: require.resolve("@typescript-eslint/parser"),
        parserOptions: {
            sourceType: "module",
            ecmaVersion: 2019,
            ecmaFeatures: {
                jsx: true,
            },
            useJSXTextNode: true,
            ...parserOptions,
        },
    };
}
