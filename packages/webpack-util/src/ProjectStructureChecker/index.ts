import fs from "fs";
import path from "path";
import {checkPackageJson} from "./00_checkPackageJson";
import {checkTsconfigJson} from "./01_checkTsconfigJson";
import {checkSrcMainEntry} from "./02_checkSrcMainEntry";
import {checkSrcIndexHtml} from "./03_checkSrcIndexHtml";
import {checkPrettierConfig} from "./04_checkPrettierConfig";
import {checkEslintConfig} from "./05_checkEslintConfig";

interface ProjectStructureCheckerOptions {
    /**
     * Directory of containing the application code.
     * Should contains the package.json, tsconfig.json for your app.
     */
    projectDirectory: string;
}

export class ProjectStructureChecker {
    private readonly packageJsonFilepath: string;
    private readonly tsconfigJsonFilepath: string;
    private readonly srcIndexHtmlFilepath: string;
    private readonly srcDirectory: string;

    constructor(private readonly options: ProjectStructureCheckerOptions) {
        if (!(fs.existsSync(options.projectDirectory) && fs.statSync(options.projectDirectory).isDirectory())) {
            throw new Error(`options.projectDiretory is not a folder at "${options.projectDirectory}"`);
        }
        this.packageJsonFilepath = path.join(options.projectDirectory, "package.json");
        this.tsconfigJsonFilepath = path.join(options.projectDirectory, "tsconfig.json");
        this.srcDirectory = path.join(options.projectDirectory, "src");
        this.srcIndexHtmlFilepath = path.join(options.projectDirectory, "src/index.html");
    }

    run() {
        checkPackageJson({filepath: this.packageJsonFilepath});
        checkTsconfigJson({filepath: this.tsconfigJsonFilepath});
        checkSrcMainEntry({srcDirectory: this.srcDirectory});
        checkSrcIndexHtml({filepath: this.srcIndexHtmlFilepath});
        checkPrettierConfig({packageJsonFilepath: this.packageJsonFilepath});
        checkEslintConfig();
    }
}
