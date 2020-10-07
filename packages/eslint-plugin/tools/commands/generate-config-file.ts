import fs from "fs-extra";
import path from "path";
import {PathMap} from "../../config/path-map";
import * as Util from "../util";
const print = Util.createPrint("GenerateConfigFile");

interface Options extends Pick<PathMap, "srcConfigDirectory" | "srcRuleDirectory" | "templateDirectory"> {}

export class GenerateConfigFile {
    private readonly srcConfigDirectory: string;
    private readonly srcRuleDirectory: string;
    private readonly configBaselinePath: string;
    private readonly configBaselineTemplatePath: string;
    private readonly configJestPath: string;
    private readonly configJestTemplatePath: string;

    constructor(_: Options) {
        this.srcConfigDirectory = _.srcConfigDirectory;
        this.srcRuleDirectory = _.srcRuleDirectory;
        this.configBaselinePath = path.join(_.srcConfigDirectory, "baseline.ts");
        this.configBaselineTemplatePath = path.join(_.templateDirectory, "config-baseline.ts");
        this.configJestPath = path.join(_.srcConfigDirectory, "jest.ts");
        this.configJestTemplatePath = path.join(_.templateDirectory, "config-jest.ts");
    }

    async run() {
        try {
            this.removeConfigFiles();
            this.generateConfigFiles(this.scanRules());
        } catch (e) {
            print.error(e);
            process.exit(1);
        }
    }

    private removeConfigFiles() {
        print.task(["Removing baseline.ts at", this.configBaselinePath]);
        fs.removeSync(this.configBaselinePath);
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

    private generateConfigFiles(allRules: ReadonlyArray<{kebab: string; camel: string}>) {
        print.task("Generating baseline.ts file");
        const ruleDefinitions = allRules
            .map(_ => {
                return `"@pinnacle0/${_.kebab}": ["error"],`;
            })
            .join("\n        ");
        const output = fs
            .readFileSync(this.configBaselineTemplatePath, {
                encoding: "utf8",
            })
            .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
        fs.writeFileSync(this.configBaselinePath, output);

        fs.copySync(this.configJestTemplatePath, this.configJestPath, {overwrite: true});
    }
}
