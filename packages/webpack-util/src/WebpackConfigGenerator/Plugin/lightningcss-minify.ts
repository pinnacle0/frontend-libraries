import type {BasicMinimizerImplementation} from "css-minimizer-webpack-plugin";
import type {TransformOptions} from "lightningcss";
import type {Targets} from "lightningcss/node/targets";

export const lightningcssMinify: BasicMinimizerImplementation<{targets: Targets}> = (input, sourceMap, minimizerOptions) => {
    // use variables outside function scope will lead to error
    const [[filename, code]] = Object.entries(input);
    const buildLightningCssOptions = (lightningCssOptions = {}): TransformOptions<any> => {
        return {
            minify: true,
            ...lightningCssOptions,
            sourceMap: false,
            filename,
            code: Buffer.from(code),
        };
    };
    const lig = require("lightningcss");
    const lightningCssOptions = buildLightningCssOptions(minimizerOptions);

    try {
        const result = lig.transform(lightningCssOptions);
        return Promise.resolve({
            code: result.code.toString(),
            map: result.map ? JSON.parse(result.map.toString()) : undefined,
        });
    } catch (e) {
        if (e instanceof Error) {
            const fs = require("fs");
            const path = require("path");
            const chalk = require("chalk");

            let message = e.message;
            if ("source" in e && "loc" in e) {
                const source = e.source as string;
                const loc = e.loc as {line: number; column: number};
                message += ` loc:[${loc.line}:${loc.column}]\n`;
                const lines = source
                    .split("\n")
                    .slice(Math.max(0, loc.line - 3), loc.line + 3)
                    .map((_, i) => `\t${chalk.greenBright(loc.line - 2 + i)}  \t${_}`);
                lines[2] = chalk.redBright.underline(lines[2]);
                message += lines.join("\n");
            }

            const prettierError = new Error();
            prettierError.name = e.name;
            prettierError.message = message;
            // @ts-ignore
            fs.writeFileSync(path.join(process.cwd(), "error.txt"), e.source);
            throw prettierError;
        } else {
            throw e;
        }
    }
};
