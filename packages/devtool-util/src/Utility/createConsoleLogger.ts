import chalk = require("chalk");

/**
 * Creates a logger instance to `console.log` fancy messages with emojis to the terminal.
 *
 * Example usage:
 * ```ts
 * const print = Utility.createConsoleLogger("BuildScript");
 * print.info("Build starting");
 * print.task("Running lint");
 * try {
 *     // Run eslint
 * } catch (error) {
 *     print.error("Lint failed, please fix!");
 *     process.exit(1);
 * }
 * // ...
 * print.info("Build successful");
 * ```
 *
 * @param descriptiveTitle A title to be included in every log message created by this logger.
 */
export function createConsoleLogger(descriptiveTitle: string) {
    const curriedPrint = (emoji: string) => (color: "blueBright" | "greenBright" | "redBright") => {
        return (descriptiveTitle: string) => (text: string | Error | Array<string | Error>) => {
            const body = chalk.whiteBright.bgBlack((Array.isArray(text) ? text : [text]).map(_ => _.toString()).join(" "));
            console.info("");
            console.info(chalk[color].bold(`${emoji}  [${descriptiveTitle}]`) + body);
        };
    };

    return {
        info: curriedPrint("ℹ️")("blueBright")(descriptiveTitle),
        task: curriedPrint("🛠")("greenBright")(descriptiveTitle),
        error: curriedPrint("❌")("redBright")(descriptiveTitle),
    };
}
