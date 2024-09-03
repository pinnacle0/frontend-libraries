import fs from "fs";
import path from "path";
import yargs from "yargs";
import {NamingUtil} from "../NamingUtil";
import {PrettierUtil} from "../PrettierUtil";
import {Utility} from "../Utility";
import type {ModuleGeneratorOptions} from "./type";

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

    private readonly logger = Utility.createConsoleLogger("ModuleGenerator");

    constructor(options: ModuleGeneratorOptions) {
        this.moduleName = String(yargs.parseSync()._[0]);
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
                fs.rmSync(this.newModuleDirectory, {recursive: true});
            } catch {
                // Do nothing
            }
            this.logger.error(e);
            process.exit(1);
        }
    }

    async update() {
        try {
            const modules = fs.readdirSync(this.moduleBaseDirectory, {withFileTypes: true});
            for (const module of modules) {
                if (module.isDirectory()) {
                    if (module.name === "main") {
                        this.updateModuleStructure("main");
                    } else {
                        this.updateSubModuleStructure(module.name);
                    }
                }
            }
            PrettierUtil.format(this.moduleBaseDirectory);
        } catch (e) {
            this.logger.error(e);
            process.exit(1);
        }
    }

    private checkPreCondition() {
        this.logger.info("Checking pre-conditions");

        const splitModuleNames = this.moduleName.split("/");
        const availableTopLevelModuleNames = fs
            .readdirSync(this.moduleBaseDirectory, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory() && dirent.name !== "main")
            .map(dirent => dirent.name);

        if (!fs.existsSync(this.reduxStateTypePath)) throw new Error(`Redux state file [${this.reduxStateTypePath}] does not exist`);
        if (!this.moduleName) throw new Error("Module name must be specified (via command line, or constructor)");
        if (splitModuleNames.length < 2 || splitModuleNames.length > 3) throw new Error("Module name must be of parent/child or grandparent/parent/child format");
        if (!availableTopLevelModuleNames.includes(splitModuleNames[0])) throw new Error(`Module [${splitModuleNames[0]}] must be one of ${availableTopLevelModuleNames.join("/")}`);

        splitModuleNames.slice(1).forEach(_ => {
            if (!NamingUtil.isKebabCase(_)) throw new Error(`Module name [${_}] does not conform to naming convention`);
        });

        if (fs.existsSync(this.newModuleDirectory)) throw new Error(`Module [${this.moduleName}] already exists`);
    }

    private copyTemplate() {
        this.logger.task(["Copying template to target", this.newModuleDirectory]);
        fs.mkdirSync(`${this.newModuleDirectory}/Main`, {recursive: true});
        const files = ["Main/index.tsx", "Main/index.less", "hooks.ts", "index.ts", "type.ts", "module.ts"];
        for (const file of files) {
            fs.copyFileSync(`${this.templateDirectory}/${file}.template`, `${this.newModuleDirectory}/${file}`);
        }
    }

    private updateTemplateContent() {
        const indexPath = `${this.newModuleDirectory}/module.ts`;
        this.logger.task(["Updating module.ts", indexPath]);
        Utility.replaceTemplate(indexPath, [
            this.getModuleNameInFormat("pascal"), // {1}
            this.getModuleNameInFormat("camel"), // {2}
        ]);

        const hooksPath = `${this.newModuleDirectory}/hooks.ts`;
        this.logger.task(["Updating hooks.ts", hooksPath]);
        Utility.replaceTemplate(hooksPath, [
            this.getModuleNameInFormat("pascal"), // {1}
            this.getModuleNameInFormat("camel"), // {2}
        ]);

        const componentPath = `${this.newModuleDirectory}/Main/index.tsx`;
        this.logger.task(["Updating Main/index.tsx", componentPath]);
        Utility.replaceTemplate(componentPath, [this.getModuleNameInFormat("camel")]);
    }

    private updateReduxState() {
        this.logger.task(["Updating redux state definition", this.reduxStateTypePath]);

        const stateFileContent = fs.readFileSync(this.reduxStateTypePath).toString();
        const lastStateDeclarationIndex = stateFileContent.lastIndexOf("};");
        if (lastStateDeclarationIndex === -1) throw new Error("Cannot find state declaration");
        const firstLineEndIndex = stateFileContent.indexOf("\n");
        if (lastStateDeclarationIndex === -1) throw new Error("Cannot find core import");

        const moduleFullName = this.getModuleNameInFormat("camel");
        const moduleStateName = this.getModuleNameInFormat("pascal") + "State";
        const newStateFileContent =
            stateFileContent.slice(0, firstLineEndIndex + 1) +
            this.generateImportStatementForNewModuleState({moduleStateName, partialModulePath: this.moduleName}) +
            "\n" +
            stateFileContent.substring(firstLineEndIndex + 1, lastStateDeclarationIndex) +
            `${moduleFullName}: ${moduleStateName};\n` +
            stateFileContent.slice(lastStateDeclarationIndex);

        fs.writeFileSync(this.reduxStateTypePath, newStateFileContent, {encoding: "utf8"});
    }

    private formatSources() {
        PrettierUtil.format(`${this.moduleBaseDirectory}/${this.moduleName}`);
        PrettierUtil.format(this.reduxStateTypePath);
    }

    private updateSubModuleStructure(moduleName: string) {
        const subModulesPath = path.join(this.moduleBaseDirectory, moduleName);
        const subModules = fs.readdirSync(subModulesPath, {withFileTypes: true});
        for (const subModule of subModules) {
            if (subModule.isDirectory()) {
                this.updateModuleStructure(moduleName + "/" + subModule.name);
            }
        }
    }

    private updateModuleStructure(moduleName: string) {
        try {
            this.checkUpdateModuleStructure(moduleName);
        } catch (e: any) {
            this.logger.error(e.message);
            return;
        }

        const modulePath = path.join(this.moduleBaseDirectory, moduleName);

        if (fs.existsSync(path.join(modulePath, "module.ts"))) {
            this.logger.info(`Module ${moduleName} already updated`);
            return;
        }

        this.createModuleFile(moduleName);

        fs.copyFileSync(`${this.templateDirectory}/index.ts.template`, `${modulePath}/index.ts`);

        this.updateComponent(moduleName);

        this.logger.task(`Module ${moduleName} updated`);
    }

    private checkUpdateModuleStructure(moduleName: string) {
        const existFiles = ["index.ts", "type.ts", "hooks.ts", "Main/index.tsx"];
        if (!existFiles.every(file => fs.existsSync(path.join(this.moduleBaseDirectory, moduleName, file)))) {
            throw new Error(`Module ${moduleName} have special structure, please update it manually`);
        }
    }

    private createModuleFile(moduleName: string) {
        const modulePath = path.join(this.moduleBaseDirectory, moduleName);

        const originalIndexTS = path.join(modulePath, "index.ts");
        const newModuleTS = path.join(modulePath, "module.ts");
        const file = fs.readFileSync(originalIndexTS, "utf8");

        const moduleNameInFormat = this.getModuleNameInFormat("camel", moduleName);

        const newFile = file
            .replace('import { Main } from "./Main";', "")
            .replace(`export const MainComponent: React.ComponentType = ${moduleNameInFormat}Module.attachLifecycle(Main);`, "")
            .replace(`const ${moduleNameInFormat}Module = register(new `, `export const ${moduleNameInFormat}Module = register(new `);

        fs.writeFileSync(newModuleTS, newFile, "utf8");
    }

    private updateComponent(moduleName: string) {
        const componentPath = path.join(this.moduleBaseDirectory, moduleName, "Main", "index.tsx");
        let file = fs.readFileSync(componentPath, "utf8");
        const moduleNameInFormat = this.getModuleNameInFormat("camel", moduleName);
        file = `import {${moduleNameInFormat}Module} from "../module";\n` + file;

        const reactMemoRegEx = /const\s+Main\s*=\s*React(?:Util)?\.memo\(/;
        const lifecycleAttach = `const Main = ${moduleNameInFormat}Module.attachLifecycle(`;

        let newFile = "";
        if (file.search(reactMemoRegEx) !== -1) {
            newFile += file.replace(reactMemoRegEx, lifecycleAttach);
        } else {
            newFile += file.replace(/const Main\s*=\s*\(\)\s*=>|const Main\(\)/, lifecycleAttach + "() => ") + ")";
        }
        fs.writeFileSync(componentPath, newFile, "utf8");
    }

    /**
     * Create a name based on this.moduleName.
     *
     *
     * For example: this.moduleName is "account/order-detail"
     * (format = "pascal") => AccountOrderDetail
     * (format = "camel") => accountOrderDetail
     *
     * Special case: for common/some-name module, common will be omitted.
     * @param format "pascal" or "camel"
     * @param moduleName
     */
    private getModuleNameInFormat(format: "pascal" | "camel", moduleName?: string) {
        moduleName = moduleName ?? this.moduleName;
        return moduleName
            .split("/")
            .filter((_, index) => !(_ === "common" && index === 0))
            .map((_, index) => (index === 0 && format === "camel" ? NamingUtil.toCamelCase(_) : NamingUtil.toPascalCase(_)))
            .join("");
    }
}
