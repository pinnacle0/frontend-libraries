import {TaskRunner} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import {isKebabCase, kebabToCamelCase} from "./util";

const directory = {
    src: path.join(__dirname, "../src"),
    srcRules: path.join(__dirname, "../src/rules"),
    templates: path.join(__dirname, "../script/templates"),
    testRules: path.join(__dirname, "../test/rules"),
};

const newRuleName = yargs.argv._[0];
if (typeof newRuleName !== "string") {
    throw new Error("Missing positional cli argument (new rule name), usage: yarn new-rule custom-new-eslint-rule-name");
}
const newRuleFile = path.join(directory.srcRules, `${newRuleName}.ts`);
const newTestFile = path.join(directory.testRules, `${newRuleName}.test.ts`);

new TaskRunner("new-rule").execute([
    {
        name: "check pre-conditions",
        execute: () => {
            if (!isKebabCase(newRuleName)) {
                throw new Error(`Rule name should be in kebab-case, but received "${newRuleName}".`);
            }
            if (fs.existsSync(newRuleFile)) {
                throw new Error(`Rule "${newRuleName}" already exists at "${newRuleFile}".`);
            }
            if (fs.existsSync(newTestFile)) {
                throw new Error(`Rule "${newRuleName}" already exists`);
            }
        },
    },
    {
        name: "generate src file",
        execute: () => {
            const templateFile = path.join(directory.templates, "new-rule.ts");
            const output = fs
                .readFileSync(templateFile, {
                    encoding: "utf8",
                })
                .replaceAll("// {{KEBAB_CASE_RULE_NAME}}", newRuleName)
                .replaceAll("// {{CAMEL_CASE_RULE_NAME}}", kebabToCamelCase(newRuleName));
            fs.writeFileSync(newRuleFile, output, {encoding: "utf8"});
        },
    },
    {
        name: "generate test file",
        execute: () => {
            const templateFile = path.join(directory.templates, "new-test.ts");
            const output = fs
                .readFileSync(templateFile, {
                    encoding: "utf8",
                })
                .replaceAll("// {{KEBAB_CASE_RULE_NAME}}", newRuleName)
                .replaceAll("// {{CAMEL_CASE_RULE_NAME}}", kebabToCamelCase(newRuleName));
            fs.writeFileSync(newTestFile, output, {encoding: "utf8"});
        },
    },
    {
        name: "codegen",
        execute: () => {
            // Inline require because codegen.ts runs with side effect
            require("./codegen");
        },
    },
]);
