import fs from "fs-extra";
import path from "path";
import {PathMap} from "../../config/path-map";
import * as Util from "../util";
const print = Util.createPrint("GenerateExportRulesFile");

interface Options extends Pick<PathMap, "srcRuleDirectory" | "templateDirectory"> {}

export class GenerateExportRulesFile {
    private readonly srcRuleDirectory: string;
    private readonly ruleIndexPath: string;
    private readonly ruleIndexTemplatePath: string;

    constructor(_: Options) {
        this.srcRuleDirectory = _.srcRuleDirectory;
        this.ruleIndexPath = path.join(_.srcRuleDirectory, "index.ts");
        this.ruleIndexTemplatePath = path.join(_.templateDirectory, "rules-index.ts");
    }

    async run() {
        try {
            this.removeRulesIndexFile();
            this.generateRulesIndexFile(this.scanRules());
        } catch (e) {
            print.error(e);
            process.exit(1);
        }
    }

    private removeRulesIndexFile() {
        print.task(["Removing index.ts at", this.ruleIndexPath]);
        fs.removeSync(this.ruleIndexPath);
    }

    private scanRules(): ReadonlyArray<{kebab: string; camel: string}> {
        print.task("Scanning rules folder for rules");
        return fs
            .readdirSync(this.srcRuleDirectory)
            .map(file => {
                const baseFileName = path.basename(file, ".ts");
                console.info(`- ${baseFileName}`);
                return {kebab: baseFileName, camel: Util.kebabToCamelCase(baseFileName)};
            })
            .filter(({kebab}) => kebab !== "index")
            .sort((a, b) => a.camel.localeCompare(b.camel));
    }

    private generateRulesIndexFile(allRules: ReadonlyArray<{kebab: string; camel: string}>) {
        print.task("Generating index.ts file");
        const importStatements = allRules
            .map(_ => {
                return `import {rule as ${_.camel}} from "./${_.kebab}";`;
            })
            .join("\n");
        const ruleDefinitions = allRules
            .map(_ => {
                return `"${_.kebab}": ${_.camel},`;
            })
            .join("\n    ");
        const output = fs
            .readFileSync(this.ruleIndexTemplatePath, {
                encoding: "utf8",
            })
            .replace("// {{TEMPLATE_IMPORT_STATEMENTS}}", importStatements)
            .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
        fs.writeFileSync(this.ruleIndexPath, output);
    }
}
