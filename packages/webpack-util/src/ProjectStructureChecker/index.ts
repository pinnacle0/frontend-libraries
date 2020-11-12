import fs from "fs";
import path from "path";
import {checkPackageJson} from "./01_checkPackageJson";
import {checkTsconfigJson} from "./02_checkTsconfigJson";
import {checkSrcMainEntry} from "./03_checkSrcMainEntry";
import {checkSrcIndexHtml} from "./04_checkSrcIndexHtml";
import {checkPrettierConfig} from "./05_checkPrettierConfig";
import {checkEslintConfig} from "./06_checkEslintConfig";
import {checkStylelintConfig} from "./07_checkStylelintConfig";

interface ProjectStructureCheckerOptions {
    /**
     * Directory of containing the application code.
     * Should contains `package.json`, `tsconfig.json`, `src/`, `index.html` and a main entry.
     */
    projectDirectory: string;
    /**
     * Directories that are transitively depended on by the application,
     * and should be also checked by static analysis tools along the application project folder.
     * Should contains `package.json`, `tsconfig.json`, `src/`.
     */
    extraCheckDirectories: string[];
}

export class ProjectStructureChecker {
    private readonly directories: [string, ...string[]];
    private readonly packageJsonFilepaths: [string, ...string[]];
    private readonly tsconfigJsonFileTuples: [{srcDirectory: string; filepath: string}, ...{srcDirectory: string; filepath: string}[]];
    private readonly projectSrcDirectory: string;
    private readonly projectSrcIndexHtmlFilepath: string;

    constructor(private readonly options: ProjectStructureCheckerOptions) {
        this.directories = [options.projectDirectory];
        for (const directory of options.extraCheckDirectories) {
            this.directories.push(directory);
        }

        this.packageJsonFilepaths = [path.join(options.projectDirectory, "package.json")];
        for (const directory of options.extraCheckDirectories) {
            this.packageJsonFilepaths.push(path.join(directory, "package.json"));
        }

        this.tsconfigJsonFileTuples = [{srcDirectory: path.join(options.projectDirectory, "src"), filepath: path.join(options.projectDirectory, "tsconfig.json")}];
        for (const directory of options.extraCheckDirectories) {
            this.tsconfigJsonFileTuples.push({srcDirectory: path.join(directory, "src"), filepath: path.join(directory, "tsconfig.json")});
        }

        this.projectSrcDirectory = path.join(options.projectDirectory, "src");

        this.projectSrcIndexHtmlFilepath = path.join(options.projectDirectory, "src/index.html");
    }

    run() {
        for (const directory of this.directories) {
            if (!(fs.existsSync(directory) && fs.statSync(directory).isDirectory())) {
                throw new Error(`Cannot check directory at "${directory}" because it is not a folder.`);
            }
            const srcDirectory = path.join(directory, "src");
            if (!(fs.existsSync(srcDirectory) && fs.statSync(srcDirectory).isDirectory())) {
                throw new Error(`Cannot find "src" folder inside directory at "${directory}".`);
            }
        }
        for (const packageJsonFilepath of this.packageJsonFilepaths) {
            checkPackageJson({filepath: packageJsonFilepath});
        }
        for (const tsconfigJsonFileTuple of this.tsconfigJsonFileTuples) {
            checkTsconfigJson(tsconfigJsonFileTuple);
        }
        checkSrcMainEntry({srcDirectory: this.projectSrcDirectory});
        checkSrcIndexHtml({filepath: this.projectSrcIndexHtmlFilepath});
        checkPrettierConfig({packageJsonFilepath: this.packageJsonFilepaths[0]});
        checkEslintConfig();
        checkStylelintConfig();
    }
}
