import {NamingUtil, TaskRunner, Utility} from "@pinnacle0/devtool-util";
import fs from "fs";
import path from "path";

const print = Utility.createConsoleLogger("codegen");
const directory = {
    src: path.join(__dirname, "../src"),
    srcRules: path.join(__dirname, "../src/rules"),
    template: path.join(__dirname, "../script/template"),
};

function scanCustomRules() {
    return fs
        .readdirSync(directory.srcRules)
        .map(file => {
            const fileBasename = path.basename(file, ".ts");
            console.info(`- ${fileBasename}`);
            return {kebab: fileBasename, camel: NamingUtil.toCamelCase(fileBasename)};
        })
        .filter(_ => _.kebab !== "index")
        .sort((a, b) => a.camel.localeCompare(b.camel));
}

new TaskRunner("codegen").execute([
    {
        name: "generate src/rules/index.ts",
        execute: () => {
            const rulesIndexFile = path.join(directory.srcRules, "index.ts");
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
                const templateFile = path.join(directory.template, "rules-index.ts");
                return fs
                    .readFileSync(templateFile, {
                        encoding: "utf8",
                    })
                    .replace("// {{TEMPLATE_IMPORT_STATEMENTS}}", importStatements)
                    .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
            })();

            fs.writeFileSync(rulesIndexFile, output, {encoding: "utf8"});
        },
    },
    {
        name: "generate src/config/*.ts",
        execute: () => {
            const templateFile = path.join(directory.template, "configs.ts");

            const allRules = scanCustomRules();

            const configFile = path.join(directory.src, `config/index.ts`);
            if (fs.existsSync(configFile) && fs.statSync(configFile).isFile()) {
                print.task(`Removing config/index.ts`);
                fs.unlinkSync(configFile);
            }

            const output = (function () {
                print.task(`Generating config/index.ts`);
                const ruleDefinitions = allRules
                    .map(_ => {
                        return `"@pinnacle0/${_.kebab}": ["error"],`;
                    })
                    .join("\n        ");
                return fs
                    .readFileSync(templateFile, {
                        encoding: "utf8",
                    })
                    .replace("// {{TEMPLATE_RULE_DEFINITIONS}}", ruleDefinitions);
            })();

            fs.writeFileSync(configFile, output, {encoding: "utf8"});
        },
    },
]);
