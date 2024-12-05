import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/codemod test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/codemod/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "../test/tsconfig.json",
        },
    },
});
