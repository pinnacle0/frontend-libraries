import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "web-ui unit test",
        bail: 1,
        environment: "jsdom",
        root: "../",
        include: ["**/web-ui/test/unit-test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "./tsconfig.test.json",
        },
    },
});
