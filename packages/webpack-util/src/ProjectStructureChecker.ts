import fs from "fs";
import glob from "glob";
import path from "path";
import {Constant} from "./Constant";
import type {InternalCheckerOptions} from "./type";

export class ProjectStructureChecker {
    private readonly projectDirectory: string;
    private readonly extraCheckDirectories: string[];
    private readonly packageJSONPath: string;
    private readonly tsConfigPath: string;

    constructor(private readonly options: InternalCheckerOptions) {
        this.projectDirectory = options.projectDirectory;
        this.extraCheckDirectories = options.extraCheckDirectories ?? [];
        this.packageJSONPath = path.join(options.projectDirectory, "package.json");
        this.tsConfigPath = path.join(options.projectDirectory, "tsconfig.json");
    }

    run() {
        this.checkMainProjectDirectory();
        this.checkMainProjectSrcDirectory();
        this.checkExtraDirectories();
        this.checkPackageJSON();
        this.checkTSConfig();

        this.checkPrettierInstallation();
        this.checkESLintInstallation();
        this.checkStyleLintInstallation();
    }

    private checkMainProjectDirectory() {
        if (!(fs.existsSync(this.projectDirectory) && fs.statSync(this.projectDirectory).isDirectory())) {
            throw new Error(`Cannot check project directory at "${this.projectDirectory}" because it is not a folder.`);
        }

        const mainProjectStaticDirectory = path.join(this.projectDirectory, "static");
        if (!(fs.existsSync(mainProjectStaticDirectory) && fs.statSync(mainProjectStaticDirectory).isDirectory())) {
            throw new Error(`Cannot find "static" directory in project at "${this.projectDirectory}"`);
        }
    }

    private checkMainProjectSrcDirectory() {
        const mainProjectSrcDirectory = path.join(this.projectDirectory, "src");
        if (!(fs.existsSync(mainProjectSrcDirectory) && fs.statSync(mainProjectSrcDirectory).isDirectory())) {
            throw new Error(`Cannot find "src" folder inside directory at "${this.projectDirectory}".`);
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
            throw new Error(`Cannot find main entry file in src/ at "${mainProjectSrcDirectory}"; checked: ${Constant.mainEntryFilenames.map(_ => `"${_}"`).join(" / ")}.`);
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
        if (!(fs.existsSync(this.packageJSONPath) && fs.statSync(this.packageJSONPath).isFile())) {
            throw new Error(`Cannot find package.json at "${this.packageJSONPath}".`);
        }
        const packageJSONContents: Record<string, any> = JSON.parse(fs.readFileSync(this.packageJSONPath, {encoding: "utf8"}));
        for (const [depName, depVersion] of Object.entries<string>(packageJSONContents.dependencies || {})) {
            if (!/^\d/.test(depVersion)) {
                throw new Error(`Dependency "${depName}" must be an exact version, but found "${depVersion}" in package.json at "${this.packageJSONPath}".`);
            }
        }
        for (const [depName, depVersion] of Object.entries<string>(packageJSONContents.devDependencies || {})) {
            if (!/^\d/.test(depVersion)) {
                throw new Error(`Dependency "${depName}" must be an exact version, but found "${depVersion}" in package.json at "${this.packageJSONPath}".`);
            }
        }
    }

    private checkTSConfig() {
        const mainProjectSrcDirectory = path.join(this.projectDirectory, "src");
        const hasTypescriptFiles = glob.sync("**/*.{ts,tsx}", {cwd: mainProjectSrcDirectory}).length > 0;
        const hasTSConfigFile = fs.existsSync(this.tsConfigPath) && fs.statSync(this.tsConfigPath).isFile();
        if (hasTypescriptFiles && !hasTSConfigFile) {
            throw new Error(`Cannot find tsconfig.json at "${this.tsConfigPath}".`);
        }
    }

    private checkPrettierInstallation() {
        try {
            require("prettier");
        } catch {
            throw new Error(`Cannot load prettier module (requiring from "webpack-util"), make sure prettier is installed.`);
        }
    }

    private checkESLintInstallation() {
        try {
            require("eslint");
        } catch {
            throw new Error(`Cannot load eslint module (requiring from "webpack-util"), make sure eslint is installed.`);
        }
    }

    private checkStyleLintInstallation() {
        try {
            require("stylelint");
        } catch {
            throw new Error(`Cannot load stylelint module (requiring from "webpack-util"), make sure stylelint is installed.`);
        }
    }
}
