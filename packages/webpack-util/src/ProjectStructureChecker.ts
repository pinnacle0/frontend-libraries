import fs from "fs";
import path from "path";
import {Constant} from "./Constant.js";
import type {InternalCheckerOptions} from "./type.js";

export class ProjectStructureChecker {
    private readonly projectDirectory: string;
    private readonly extraCheckDirectories: string[];
    private readonly packageJSONPath: string;
    private readonly tsConfigFilePath: string;

    constructor(options: InternalCheckerOptions) {
        this.projectDirectory = options.projectDirectory;
        this.extraCheckDirectories = options.extraCheckDirectories ?? [];
        this.packageJSONPath = path.join(options.projectDirectory, "package.json");
        this.tsConfigFilePath = options.tsconfigFilePath;
    }

    run() {
        this.checkMainProjectDirectory();
        this.checkMainProjectSrcDirectory();
        this.checkExtraDirectories();
        this.checkPackageJSON();
        this.checkTSConfig();

        this.checkBiomeInstallation();
        this.checkESLintInstallation();
        this.checkStyleLintInstallation();
    }

    private checkMainProjectDirectory() {
        if (!fs.existsSync(this.projectDirectory) || !fs.statSync(this.projectDirectory).isDirectory()) {
            throw new Error(`Cannot check project directory at "${this.projectDirectory}" because it is not a folder.`);
        }

        const mainProjectStaticDirectory = path.join(this.projectDirectory, "static");
        if (fs.existsSync(mainProjectStaticDirectory) && !fs.statSync(mainProjectStaticDirectory).isDirectory()) {
            throw new Error(`Directory /static must be a folder.`);
        }
    }

    private checkMainProjectSrcDirectory() {
        const mainProjectSrcDirectory = path.join(this.projectDirectory, "src");
        if (!(fs.existsSync(mainProjectSrcDirectory) && fs.statSync(mainProjectSrcDirectory).isDirectory())) {
            throw new Error(`Cannot find /src folder inside directory at "${this.projectDirectory}".`);
        }

        let isMainEntryFound = false;
        Constant.mainEntryFilenames
            .map(entryName => path.join(mainProjectSrcDirectory, entryName))
            .forEach(entryPath => {
                if (fs.existsSync(entryPath) && fs.statSync(entryPath).isFile()) {
                    isMainEntryFound = true;
                }
            });
        if (!isMainEntryFound) {
            throw new Error(`Cannot find main entry file in /src at "${mainProjectSrcDirectory}"; checked: ${Constant.mainEntryFilenames.map(_ => `"${_}"`).join(" / ")}.`);
        }
    }

    private checkExtraDirectories() {
        for (const extraCheckDirectory of this.extraCheckDirectories) {
            if (!(fs.existsSync(extraCheckDirectory) && fs.statSync(extraCheckDirectory).isDirectory())) {
                throw new Error(`Cannot check extra directory at "${extraCheckDirectory}" because it is not a folder.`);
            }
        }
    }

    private checkPackageJSON() {
        const startWithDigit = /^\d/;
        const startWithWorkSpace = /^workspace:/;
        if (!(fs.existsSync(this.packageJSONPath) && fs.statSync(this.packageJSONPath).isFile())) {
            throw new Error(`Cannot find package.json at "${this.packageJSONPath}".`);
        }
        const packageJSONContents: Record<string, any> = JSON.parse(fs.readFileSync(this.packageJSONPath, {encoding: "utf8"}));
        for (const [depName, depVersion] of Object.entries<string>(packageJSONContents.dependencies || {})) {
            if (startWithWorkSpace.test(depVersion)) continue;
            if (!startWithDigit.test(depVersion)) {
                throw new Error(`Dependency "${depName}" must be an exact version, but found "${depVersion}" in package.json at "${this.packageJSONPath}".`);
            }
        }
        for (const [depName, depVersion] of Object.entries<string>(packageJSONContents.devDependencies || {})) {
            if (startWithWorkSpace.test(depVersion)) continue;
            if (!startWithDigit.test(depVersion)) {
                throw new Error(`Dependency "${depName}" must be an exact version, but found "${depVersion}" in package.json at "${this.packageJSONPath}".`);
            }
        }
    }

    private checkTSConfig() {
        const mainProjectSrcDirectory = path.join(this.projectDirectory, "src");
        // Checking the first-level of src/* is enough here
        const hasTSFiles = fs.readdirSync(mainProjectSrcDirectory).some(fileName => fileName.endsWith(".ts") || fileName.endsWith(".tsx"));
        const hasTSConfigFile = fs.existsSync(this.tsConfigFilePath) && fs.statSync(this.tsConfigFilePath).isFile();
        if (hasTSFiles && !hasTSConfigFile) {
            throw new Error(`Cannot find tsconfig.json: "${this.tsConfigFilePath}".`);
        }
    }

    private checkBiomeInstallation() {
        try {
            // special case: '@biomejs/biome' has no js export, is a cli tool
            import("@biomejs/biome/package.json");
        } catch {
            throw new Error(`Cannot load biome module (requiring from "webpack-util"), make sure biome is installed.`);
        }
    }

    private checkESLintInstallation() {
        try {
            import("eslint");
        } catch {
            throw new Error(`Cannot load eslint module (requiring from "webpack-util"), make sure eslint is installed.`);
        }
    }

    private checkStyleLintInstallation() {
        try {
            import("stylelint");
        } catch {
            throw new Error(`Cannot load stylelint module (requiring from "webpack-util"), make sure stylelint is installed.`);
        }
    }
}
