import fs from "fs-extra";
import path from "path";
import {PathMap} from "../../config/path-map";
import * as Util from "../util";

const print = Util.createPrint("GenerateNewTest");

interface Options extends Pick<PathMap, "testRuleDirectory" | "templateDirectory"> {
    newRuleTestName: string;
}

export class GenerateNewTest {
    private readonly testRuleDirectory: string;
    private readonly testTemplatePath: string;
    private readonly newRuleTestName: string;
    private readonly newRuleTestPath: string;
    constructor(_: Options) {
        this.testRuleDirectory = _.testRuleDirectory;
        this.testTemplatePath = path.join(_.templateDirectory, "test.ts");
        this.newRuleTestName = _.newRuleTestName;
        this.newRuleTestPath = path.join(this.testRuleDirectory, `${this.newRuleTestName}.test.ts`);
    }

    run() {
        try {
            this.checkPreCondition();
            this.copyTemplate();
            this.updateTemplateContent();
        } catch (e) {
            try {
                fs.removeSync(this.newRuleTestPath);
            } catch (e) {
                // Do nothing
            }
            print.error(e);
        }
    }

    private checkPreCondition() {
        print.task("Checking pre-conditions");
        console.log(this.newRuleTestName);
        if (!Util.isKebabCase(this.newRuleTestName)) {
            throw new Error("Rule [${this.ruleName}] is not in kebab-case");
        }
        if (fs.existsSync(this.newRuleTestPath)) {
            throw new Error(`Rule [${this.newRuleTestName}] already exists`);
        }
    }

    private copyTemplate() {
        print.task(["Copying template to target", this.newRuleTestPath]);
        fs.copySync(this.testTemplatePath, this.newRuleTestPath);
    }

    private updateTemplateContent() {
        print.task(["Updating generated test file", this.newRuleTestPath]);
        Util.replaceTemplate(this.newRuleTestPath, [
            this.getRuleNameInFormat("camel"), // {1}
            this.getRuleNameInFormat("kebab"), // {2}
        ]);
    }

    private getRuleNameInFormat(format: "camel" | "kebab"): string {
        return format === "kebab" ? this.newRuleTestName : Util.kebabToCamelCase(this.newRuleTestName);
    }
}
