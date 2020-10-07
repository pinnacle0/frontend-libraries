import fs from "fs-extra";
import path from "path";
import {PathMap} from "../../config/path-map";
import * as Util from "../util";

const print = Util.createPrint("GenerateNewRule");

interface Options extends Pick<PathMap, "srcRuleDirectory" | "templateDirectory"> {
    newRuleName: string;
}

export class GenerateNewRule {
    private readonly srcRuleDirectory: string;
    private readonly ruleTemplatePath: string;
    private readonly newRuleName: string;
    private readonly newRulePath: string;

    constructor(_: Options) {
        this.srcRuleDirectory = _.srcRuleDirectory;
        this.ruleTemplatePath = path.join(_.templateDirectory, "rule.ts");
        this.newRuleName = _.newRuleName;
        this.newRulePath = path.join(this.srcRuleDirectory, `${this.newRuleName}.ts`);
    }

    run() {
        try {
            this.checkPreCondition();
            this.copyTemplate();
            this.updateTemplateContent();
        } catch (error) {
            try {
                fs.removeSync(this.newRulePath);
            } catch (_) {
                // Do nothing
            }
            print.error(error);
            process.exit(1);
        }
    }

    private checkPreCondition() {
        print.task(["Checking pre-conditions", this.newRuleName]);
        if (!Util.isKebabCase(this.newRuleName)) {
            throw new Error(`Rule "${this.newRuleName}" is not in kebab-case`);
        }
        if (fs.existsSync(this.newRulePath)) {
            throw new Error(`Rule "${this.newRulePath}" already exists`);
        }
    }

    private copyTemplate() {
        print.task(["Copying template to target", this.newRulePath]);
        fs.copySync(this.ruleTemplatePath, this.newRulePath);
    }

    private updateTemplateContent() {
        print.task(["Updating generated rule file", this.newRulePath]);
        Util.replaceTemplate(this.newRulePath, [
            this.getRuleNameInFormat("camel"), // {1}
            this.getRuleNameInFormat("kebab"), // {2}
        ]);
    }

    private getRuleNameInFormat(format: "camel" | "kebab"): string {
        return format === "kebab" ? this.newRuleName : Util.kebabToCamelCase(this.newRuleName);
    }
}
