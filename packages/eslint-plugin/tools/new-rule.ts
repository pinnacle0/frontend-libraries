import fs from "fs";
import path from "path";
import yargs from "yargs";
import {pathMap} from "../config/path-map";
import codegen from "./codegen";
import {createPrint, isKebabCase, kebabToCamelCase} from "./util";

const {srcDirectory, testDirectory, toolsDirectory} = pathMap;

export default function newRule() {
    const newRuleName = (function () {
        const newRuleName = yargs.argv._[1];
        if (!(typeof newRuleName === "string" && isKebabCase(newRuleName))) {
            throw new Error(`Rule name should be in kebab-case, but received "${newRuleName}"`);
        }
        return newRuleName;
    })();
    generateNewRule(newRuleName);
    generateNewTest(newRuleName);
    codegen();
    // Should not need to run formatter
}

function generateNewRule(newRuleName: string) {
    const print = createPrint("generateNewRule");
    const newRuleFile = path.join(srcDirectory, `rules/${newRuleName}.ts`);
    {
        print.task(`Checking pre-conditions of "${newRuleName}"`);
        if (fs.existsSync(newRuleFile)) {
            throw new Error(`Rule "${newRuleName}" already exists`);
        }
    }
    const output = (function () {
        print.task(`Generating rule file at "${newRuleFile}"`);
        const templateFile = path.join(toolsDirectory, "./templates/new-rule.ts");
        return fs
            .readFileSync(templateFile, {
                encoding: "utf8",
            })
            .replace("// {{KEBAB_CASE_RULE_NAME}}", newRuleName)
            .replace("// {{CAMEL_CASE_RULE_NAME}}", kebabToCamelCase(newRuleName));
    })();
    fs.writeFileSync(newRuleFile, output, {encoding: "utf8"});
}

function generateNewTest(newRuleName: string) {
    const print = createPrint("generateNewTest");
    const newTestFile = path.join(testDirectory, `rules/${newRuleName}.ts`);
    {
        print.task(`Checking pre-conditions of "${newRuleName}"`);
        if (fs.existsSync(newTestFile)) {
            throw new Error(`Rule "${newRuleName}" already exists`);
        }
    }
    const output = (function () {
        print.task(`Generating test file at "${newTestFile}"`);
        const templateFile = path.join(toolsDirectory, "./templates/new-test.ts");
        return fs
            .readFileSync(templateFile, {
                encoding: "utf8",
            })
            .replace("// {{KEBAB_CASE_RULE_NAME}}", newRuleName)
            .replace("// {{CAMEL_CASE_RULE_NAME}}", kebabToCamelCase(newRuleName));
    })();
    fs.writeFileSync(newTestFile, output, {encoding: "utf8"});
}
