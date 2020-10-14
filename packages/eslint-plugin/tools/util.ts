import chalk from "chalk";
import childProcess from "child_process";

const curriedPrint = (emoji: string) => (color: typeof chalk["Color"]) => {
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

export function runCommand(command: string) {
    return childProcess.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
    });
}

export function isKebabCase(string: string) {
    return /^[a-z-]+$/.test(string);
}

export function kebabToCamelCase(string: string) {
    return string.replace(/([-_][a-z])/g, group => group.toUpperCase().replace("-", "").replace("_", ""));
}
