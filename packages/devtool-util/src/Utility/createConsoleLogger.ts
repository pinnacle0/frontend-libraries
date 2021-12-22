import chalk from "chalk";

/**
 * Creates a logger instance to `console.log` fancy messages with emojis to the terminal.
 *
 * Example usage:
 * ```ts
 * const logger = Utility.createConsoleLogger("BuildScript");
 * logger.info("Build starting");
 * logger.task("Running lint");
 * try {
 *     // Run eslint
 * } catch (error) {
 *     logger.error("Lint failed, please fix!");
 *     process.exit(1);
 * }
 * // ...
 * logger.info("Build successful");
 * ```
 *
 * @param descriptiveTitle A title to be included in every log message created by this logger.
 */
export function createConsoleLogger(descriptiveTitle: string) {
    const curriedPrint = (emoji: string) => (color: "blueBright" | "greenBright" | "redBright") => {
        return (descriptiveTitle: string) => (text: any) => {
            const title = chalk[color].bold(`${emoji} [${descriptiveTitle}]`);
            const body = chalk.whiteBright((Array.isArray(text) ? text : [text]).map(_ => _.toString()).join(" "));
            console.info("");
            console.info(`${title} ${body}`);
        };
    };

    return {
        info: curriedPrint("ℹ️")("blueBright")(descriptiveTitle),
        task: curriedPrint("🛠")("greenBright")(descriptiveTitle),
        error: curriedPrint("❌")("redBright")(descriptiveTitle),
    };
}
