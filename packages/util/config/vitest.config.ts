import {defineConfig} from "vitest/config";
import {transformWithEsbuild, type Plugin} from "vite";

/**
 * Vite 8 transforms TypeScript with Oxc, which does not downlevel TC39 (stage-3) decorators,
 * and Node has no native decorator support yet — so `@Decorator` syntax reaches the runtime
 * untouched and throws "SyntaxError: Invalid or unexpected token".
 *
 * Pre-transform any test file that uses a member decorator through esbuild (target es2022) so
 * the decorators are lowered before Oxc runs.
 */
function decoratorTransform(): Plugin {
    const memberDecorator = /^[ \t]*@[A-Za-z_$]/m;
    return {
        name: "@pinnacle0/util:downlevel-decorators",
        enforce: "pre",
        async transform(code, id) {
            const filename = id.split("?")[0];
            if (!filename.endsWith(".ts") || !memberDecorator.test(code)) {
                return null;
            }
            const result = await transformWithEsbuild(code, filename, {target: "es2022"});
            return {code: result.code, map: result.map};
        },
    };
}

export default defineConfig({
    plugins: [decoratorTransform()],
    test: {
        name: "@pinnacle0/util test",
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
