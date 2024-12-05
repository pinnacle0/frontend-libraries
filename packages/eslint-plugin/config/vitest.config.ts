import path from "path";
import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        name: "@pinnacle0/eslint-plugin test",
        bail: 1,
        environment: "node",
        root: "../",
        include: ["**/eslint-plugin/test/**/*.test.ts"],
        typecheck: {
            enabled: true,
            checker: "tsc",
            tsconfig: "./tsconfig.test.json",
        },
        setupFiles: path.join(import.meta.dirname, "./rule-tester-setup.ts"),
    },
});
