import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/react-stack-router test",
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
