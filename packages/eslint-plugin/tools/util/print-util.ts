import chalk from "chalk";

const curriedPrint = (descriptiveTitle: string) => (tag: "info" | "task" | "error") => (text: string | Error | Array<string | Error>) => {
    const emoji = {info: "ℹ️", task: "🛠", error: "❌"}[tag];
    const color = {info: "blueBright", task: "greenBright", error: "redBright"}[tag];
    const body = chalk.whiteBright.bgBlack((Array.isArray(text) ? text : [text]).map(_ => _.toString()).join(" "));
    console.info("");
    console.info(chalk[color].bold(`${emoji}  [${descriptiveTitle}]`), body);
};

export const createPrint = (descriptiveTitle: string) => ({
    info: curriedPrint(descriptiveTitle)("info"),
    task: curriedPrint(descriptiveTitle)("task"),
    error: curriedPrint(descriptiveTitle)("error"),
});
