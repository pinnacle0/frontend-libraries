import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "util unit test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/util/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "./tsconfig.test.json",
        },
    },
});
