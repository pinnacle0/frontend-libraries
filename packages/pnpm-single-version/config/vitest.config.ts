import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/pnpm-single-version test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/pnpm-single-version/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "./tsconfig.test.json",
        },
    },
});
