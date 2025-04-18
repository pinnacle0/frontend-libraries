#!/usr/bin/env node
import yargs from "yargs";
import chalk from "chalk";
import process from "process";
import {hideBin} from "yargs/helpers";
import {resolveCodemodPath} from "./util.js";
import {Codemod} from "./type.js";
import {runner} from "./runner.js";

const packageJson = (await import("../package.json")).default;

export async function list() {
    for (const name of Codemod) {
        const path = await resolveCodemodPath(name);
        if (path) {
            const codeMod = await import(path);
            console.info(`[codemod] ${chalk.green(name)}:` + chalk.dim(codeMod.description));
        }
    }
}

const main = async () => {
    await yargs(hideBin(process.argv))
        .version(packageJson.version)
        .command(
            "transform <modType> <target>",
            "Apply codemod transform to files, path can be a glob.\nuse --dry flag to dry run",
            {
                dry: {
                    type: "boolean",
                    description: "dry run",
                },
            },
            args => runner(args.modType as Codemod, args.target as string, {dry: args.dry ?? false})
        )
        .command("list", "list all available codemod", {}, list)
        .parse();
};

main().catch(console.error);
