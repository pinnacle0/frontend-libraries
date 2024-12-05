import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/devtool-util test",
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
