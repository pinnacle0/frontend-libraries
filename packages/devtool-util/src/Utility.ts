import chalk from "chalk";

export class Utility {
    static runCommand(command: string, args: string[] = []) {
        // TODO: upwards node modules? -> system CLI?
    }

    static createConsoleLogger(descriptiveTitle: string) {
        const curriedPrint = (emoji: string) => (color: "blueBright" | "greenBright" | "redBright") => {
            return (descriptiveTitle: string) => (text: string | Error | Array<string | Error>) => {
                const body = chalk.whiteBright.bgBlack((Array.isArray(text) ? text : [text]).map(_ => _.toString()).join(" "));
                console.info("");
                console.info(chalk[color].bold(`${emoji}  [${descriptiveTitle}]`), body);
            };
        };

        return {
            info: curriedPrint("ℹ️")("blueBright")(descriptiveTitle),
            task: curriedPrint("🛠")("greenBright")(descriptiveTitle),
            error: curriedPrint("❌")("redBright")(descriptiveTitle),
        };
    }
}
