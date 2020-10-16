import chalk from "chalk";
import childProcess from "child_process";

const curriedPrint = (emoji: string) => (color: "blueBright" | "greenBright" | "redBright") => {
    return (descriptiveTitle: string) => (text: string | Error | Array<string | Error>) => {
        const body = chalk.whiteBright.bgBlack((Array.isArray(text) ? text : [text]).map(_ => _.toString()).join(" "));
        console.info("");
        console.info(chalk[color].bold(`${emoji}  [${descriptiveTitle}]`), body);
    };
};

export const createPrint = (descriptiveTitle: string) => ({
    info: curriedPrint("ℹ️")("blueBright")(descriptiveTitle),
    task: curriedPrint("🛠")("greenBright")(descriptiveTitle),
    error: curriedPrint("❌")("redBright")(descriptiveTitle),
});

export function runCommand(cwd: string) {
    return (command: string) =>
        childProcess.execSync(command, {
            stdio: "inherit",
            encoding: "utf8",
            cwd,
        });
}
