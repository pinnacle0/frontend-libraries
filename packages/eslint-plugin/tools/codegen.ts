import * as fs from "fs";
import * as path from "path";
import {pathMap} from "../config/path-map";
import {createPrint, kebabToCamelCase} from "./util";

const {srcDirectory, toolsDirectory} = pathMap;
const print = createPrint("codegen");

export default function codegen() {
    codegenRulesIndex();
    codegenESLintConfig();
}

function scanCustomRules() {
    print.task("Scanning rule definitions at src/rules/");
    const rulesDirectory = path.join(srcDirectory, "rules/");
    return fs
        .readdirSync(rulesDirectory)
        .map(file => {
            const fileBasename = path.basename(file, ".ts");
            console.info(`- ${fileBasename}`);
            return {kebab: fileBasename, camel: kebabToCamelCase(fileBasename)};
        })
        .filter(_ => _.kebab !== "index")
        .sort((a, b) => a.camel.localeCompare(b.camel));
}

function codegenRulesIndex() {
    const rulesIndexFile = path.join(srcDirectory, "rules/index.ts");
    if (fs.existsSync(rulesIndexFile) && fs.statSync(rulesIndexFile).isFile()) {
        print.task("Removing src/rules/index.ts");
        fs.unlinkSync(rulesIndexFile);
    }

    const allRules = scanCustomRules();

    const output = (function () {
        print.task("Generating src/rules/index.ts");
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
        const templateFile = path.join(toolsDirectory, "./templates/rules-index.ts");
        return fs
            .readFileSync(templateFile, {
                encoding: "utf8",
            })
            .replace("// {{TEMPLATE_IMPORT_STATEMENTS}}", importStatements)
            .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
    })();

    fs.writeFileSync(rulesIndexFile, output, {encoding: "utf8"});
}

function codegenESLintConfig() {
    const templateFiles = {
        baseline: path.join(toolsDirectory, "./templates/config-baseline.ts"),
        jest: path.join(toolsDirectory, "./templates/config-jest.ts"),
    };

    const allRules = scanCustomRules();

    for (const configName of ["baseline", "jest"] as const) {
        const configFile = path.join(srcDirectory, `config/${configName}.ts`);
        if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
            print.task(`Removing config/${configName}.ts`);
            fs.unlinkSync(configFile);
        }

        const output = (function () {
            print.task(`Generating config/${configName}.ts`);
            const ruleDefinitions = allRules
                .map(_ => {
                    return `"@pinnacle0/${_.kebab}": ["error"],`;
                })
                .join("\n        ");
            return fs
                .readFileSync(templateFiles[configName], {
                    encoding: "utf8",
                })
                .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
        })();

        fs.writeFileSync(configFile, output, {encoding: "utf8"});
    }
}
