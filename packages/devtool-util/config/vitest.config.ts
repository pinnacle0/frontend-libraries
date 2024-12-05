import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "devtool-util test case",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/devtool-util/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "../config/tsconfig.test.json",
        },
    },
});
