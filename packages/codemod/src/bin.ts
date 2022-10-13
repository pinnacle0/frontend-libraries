#!/usr/bin/env node
import yargs from "yargs";
import chalk from "chalk";
import process from "process";
import {hideBin} from "yargs/helpers";
import {resolveCodemodPath} from "./util";
import {Codemod} from "./type";
import {runner} from "./runner";

const packageJson = require("../package.json");

export async function list() {
    for (const name of Codemod) {
        const path = await resolveCodemodPath(name);
        if (path) {
            console.info(`[codemod] ${chalk.green(name)}:` + chalk.dim(require(path).description));
        }
    }
}

export async function transform(modType: string, path: string, dry: boolean = false) {
    await runner(modType as Codemod, path, {dry});
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
            args => transform(args.modType as string, args.target as string, args.dry)
        )
        .command("list", "list all available codemod", {}, list)
        .parse();
};

main().catch(console.error);
