import {TaskRunner, NamingUtil} from "@pinnacle0/devtool-util";
import fs from "fs";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import path from "path";

const Paths = {
    modDirectory: path.join(__dirname, "../src/mod"),
    testDirectory: path.join(__dirname, "../test"),
    template: path.join(__dirname, "../script/template"),
};

const newCodemodName = yargs(hideBin(process.argv)).parseSync()._[0];
if (typeof newCodemodName !== "string") {
    throw new Error("Missing positional cli argument (new codemod), usage: pnpm new-codemod custom-new-codemod-name");
}

const newCodemodFile = path.join(Paths.modDirectory, `${newCodemodName}.ts`);
const newTestFile = path.join(Paths.testDirectory, `${newCodemodName}.test.ts`);

new TaskRunner("new-codemod").execute([
    {
        name: "check pre-conditions",
        execute: () => {
            if (!NamingUtil.isKebabCase(newCodemodName)) {
                throw new Error(`Rule name should be in kebab-case, but received "${newCodemodName}".`);
            }
            if (fs.existsSync(newCodemodFile)) {
                throw new Error(`Rule "${newCodemodName}" already exists at "${newCodemodFile}".`);
            }
            if (fs.existsSync(newTestFile)) {
                throw new Error(`Rule "${newCodemodName}" already exists`);
            }
        },
    },
    {
        name: "generate src file",
        execute: () => {
            const templateFile = path.join(Paths.template, "codemod.template");
            const output = fs.readFileSync(templateFile, {encoding: "utf8"});
            fs.writeFileSync(newCodemodFile, output, {encoding: "utf8"});
        },
    },
    {
        name: "generate test file",
        execute: () => {
            const templateFile = path.join(Paths.template, "codemod-test.template");
            const output = fs.readFileSync(templateFile, {encoding: "utf8"}).replaceAll("// {{KEBAB_CASE_CODEMOD_NAME}}", newCodemodName);
            fs.writeFileSync(newTestFile, output, {encoding: "utf8"});
        },
    },
    {
        name: "Codegen",
        execute: () => import("./codegen"),
    },
]);
