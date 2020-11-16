import {Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import {isKebabCase, kebabToCamelCase} from "./util";

const print = Utility.createConsoleLogger("new-rule");
const directory = {
    src: path.join(__dirname, "../src"),
    srcRules: path.join(__dirname, "../src/rules"),
    templates: path.join(__dirname, "../script/templates"),
    testRules: path.join(__dirname, "../test/rules"),
};

function generateNewRule(newRuleName: string) {
    const newRuleFile = path.join(directory.srcRules, `${newRuleName}.ts`);
    {
        print.task(`Checking pre-conditions of "${newRuleName}"`);
        if (fs.existsSync(newRuleFile)) {
            throw new Error(`Rule "${newRuleName}" already exists`);
        }
    }
    const output = (function () {
        print.task(`Generating rule file at "${newRuleFile}"`);
        const templateFile = path.join(directory.templates, "new-rule.ts");
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
    const newTestFile = path.join(directory.testRules, `${newRuleName}.ts`);
    {
        print.task(`Checking pre-conditions of "${newRuleName}"`);
        if (fs.existsSync(newTestFile)) {
            throw new Error(`Rule "${newRuleName}" already exists`);
        }
    }
    const output = (function () {
        print.task(`Generating test file at "${newTestFile}"`);
        const templateFile = path.join(directory.templates, "new-test.ts");
        return fs
            .readFileSync(templateFile, {
                encoding: "utf8",
            })
            .replace("// {{KEBAB_CASE_RULE_NAME}}", newRuleName)
            .replace("// {{CAMEL_CASE_RULE_NAME}}", kebabToCamelCase(newRuleName));
    })();
    fs.writeFileSync(newTestFile, output, {encoding: "utf8"});
}

function newRule() {
    const newRuleName = (function () {
        const newRuleName = yargs.argv._[0];
        if (typeof newRuleName !== "string") {
            throw new Error("Missing positional cli argument (new rule name), usage: yarn new-rule custom-new-eslint-rule-name");
        }
        if (!isKebabCase(newRuleName)) {
            throw new Error(`Rule name should be in kebab-case, but received "${newRuleName}"`);
        }
        return newRuleName;
    })();
    generateNewRule(newRuleName);
    generateNewTest(newRuleName);

    // Inline require because codegen.ts runs with side effect
    require("./codegen");
}

newRule();
