import * as fs from "fs";
import * as path from "path";
import {PrettierUtil} from "../PrettierUtil";
import {Utility} from "../Utility";
import type {ModuleGeneratorOptions} from "./type";
import yargs = require("yargs");

const print = Utility.createConsoleLogger("ModuleGenerator");

/**
 * Generates boilerplate code for a `core-fe`/`core-native` Module class.
 *
 * Constructor arguments:
 * - `srcDirectory`: directory with the following structure
 *   ```
 *   src/
 *   ├── module/
 *   │       (contains `core-fe` or `core-native` modules)
 *   └── type/
 *       └── state.ts
 *           (redux root state definition file)
 *   ```
 *
 * The redux root state definition file should:
 * - contains a single interface export named `RootState`
 * - interface `rootState` has an object property named `app`
 * - example:
 *   ```ts
 *   import {State} from "core-fe";
 *   export interface RootState {
 *       app: {};
 *   }
 *   ```
 */
export class ModuleGeneratorBase {
    private readonly moduleName: string;
    private readonly moduleBaseDirectory: string;
    private readonly newModuleDirectory: string;
    private readonly reduxStateTypePath: string;
    private readonly templateDirectory: string;
    private readonly generateImportStatementForNewModuleState: (_: {moduleStateName: string; partialModulePath: string}) => string;

    constructor(options: ModuleGeneratorOptions) {
        this.moduleName = String(yargs.argv._[0]);
        this.moduleBaseDirectory = path.join(options.srcDirectory, "module");
        this.newModuleDirectory = path.join(this.moduleBaseDirectory, this.moduleName);
        this.reduxStateTypePath = path.join(options.srcDirectory, "type/state.ts");
        this.templateDirectory = options.templateDirectory;
        this.generateImportStatementForNewModuleState = options.generateImportStatementForNewModuleState;
    }

    async run() {
        try {
            this.checkPreCondition();
            this.copyTemplate();
            this.updateTemplateContent();
            this.updateReduxState();
            this.formatSources();
        } catch (e) {
            try {
                fs.rmdirSync(this.newModuleDirectory, {recursive: true});
            } catch (e) {
                // Do nothing
            }
            print.error(e);
            process.exit(1);
        }
    }

    private checkPreCondition() {
        print.info("Checking pre-conditions");

        const splitModuleNames = this.moduleName.split("/");
        const availableTopLevelModuleNames = fs
            .readdirSync(this.moduleBaseDirectory, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory() && dirent.name !== "main")
            .map(dirent => dirent.name);

        if (!fs.existsSync(this.reduxStateTypePath)) throw new Error(`Redux state file [${this.reduxStateTypePath}] does not exist`);
        if (!this.moduleName) throw new Error("Module name must be specified (via command line, or constructor)");
        if (splitModuleNames.length !== 2) throw new Error("Module name must be of parent/child format");
        if (!availableTopLevelModuleNames.includes(splitModuleNames[0])) throw new Error(`Module [${splitModuleNames[0]}] must be one of ${availableTopLevelModuleNames.join("/")}`);
        if (!/^[a-z]+?((-[a-z]+?)|(-v[0-9]+?))*$/.test(splitModuleNames[1])) throw new Error(`Module name [${splitModuleNames[1]}] does not conform to naming convention`);
        if (fs.existsSync(this.newModuleDirectory)) throw new Error(`Module [${this.moduleName}] already exists`);
    }

    private copyTemplate() {
        print.task(["Copying template to target", this.newModuleDirectory]);
        fs.mkdirSync(`${this.newModuleDirectory}/component`, {recursive: true});
        const files = ["component/Main.tsx", "hooks.ts", "index.ts", "type.ts"];
        for (const file of files) {
            fs.copyFileSync(`${this.templateDirectory}/${file}.template`, `${this.newModuleDirectory}/${file}`);
        }
    }

    private updateTemplateContent() {
        const indexPath = `${this.newModuleDirectory}/index.ts`;
        print.task(["Updating index.ts", indexPath]);
        Utility.replaceTemplate(indexPath, [
            this.getModuleNameInFormat("pascal"), // {1}
            this.getModuleNameInFormat("camel"), // {2}
        ]);

        const hooksPath = `${this.newModuleDirectory}/hooks.ts`;
        print.task(["Updating hooks.ts", hooksPath]);
        Utility.replaceTemplate(hooksPath, [
            this.getModuleNameInFormat("pascal"), // {1}
            this.getModuleNameInFormat("camel"), // {2}
        ]);
    }

    private updateReduxState() {
        print.task(["Updating redux state definition", this.reduxStateTypePath]);

        const stateFileContent = fs.readFileSync(this.reduxStateTypePath).toString();
        const lastStateDeclarationIndex = stateFileContent.lastIndexOf("};");
        if (lastStateDeclarationIndex === -1) throw new Error("Cannot find state declaration");

        const moduleFullName = this.getModuleNameInFormat("camel");
        const moduleStateName = this.getModuleNameInFormat("pascal") + "State";
        const newStateFileContent =
            this.generateImportStatementForNewModuleState({moduleStateName, partialModulePath: this.moduleName}) +
            "\n" +
            stateFileContent.substr(0, lastStateDeclarationIndex) +
            `${moduleFullName}: ${moduleStateName};\n` +
            stateFileContent.substr(lastStateDeclarationIndex);

        fs.writeFileSync(this.reduxStateTypePath, newStateFileContent, {encoding: "utf8"});
    }

    private formatSources() {
        PrettierUtil.format(`${this.moduleBaseDirectory}/${this.moduleName}`);
        PrettierUtil.format(this.reduxStateTypePath);
    }

    /**
     * Create a name based on this.moduleName.
     *
     * @param format: can be "pascal" or "camel" (default).
     *
     * For example: this.moduleName is "account/order-detail"
     * (format = "pascal") => AccountOrderDetail
     * (format = "camel") => accountOrderDetail
     *
     * Special case: for common/some-name module, common will be omitted.
     */
    private getModuleNameInFormat(format: "pascal" | "camel") {
        const replaceHyphen = (name: string, alwaysPascal: boolean) => {
            return name
                .split("-")
                .map((_, index) => (alwaysPascal || index > 0 ? _.substr(0, 1).toUpperCase() + _.slice(1) : _))
                .join("");
        };

        const [moduleName, subModuleName] = this.moduleName.split("/");
        const camelNameWithoutPostfix = moduleName === "common" ? replaceHyphen(subModuleName, false) : replaceHyphen(moduleName, false) + replaceHyphen(subModuleName, true);

        if (format === "pascal") {
            return camelNameWithoutPostfix.charAt(0).toUpperCase() + camelNameWithoutPostfix.slice(1);
        } else {
            return camelNameWithoutPostfix;
        }
    }
}
