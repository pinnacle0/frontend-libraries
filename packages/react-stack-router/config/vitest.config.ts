import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "react-stack-router unit test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/react-stack-router/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "../test/tsconfig.json",
        },
    },
});
