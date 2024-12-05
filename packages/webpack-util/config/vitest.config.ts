import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/webpack-util test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/webpack-util/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "./tsconfig.test.json",
        },
    },
});
