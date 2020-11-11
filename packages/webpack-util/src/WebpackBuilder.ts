/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require -- using dynamic require in ts-node scripts is fine */
import {PrettierUtil, Utility} from "@pinnacle0/devtool-util";
import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import {ProjectStructureChecker} from "./ProjectStructureChecker";
import {WebpackConfigGenerator, WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";

const print = Utility.createConsoleLogger("WebpackBuilder");

export interface WebpackBuilderOptions extends WebpackConfigGeneratorOptions {
    /**
     * A list of directories other than `<projectDirectory>/src` containing source files
     * that should be checked with `prettier --check`.
     */
    extraCheckFormatDirectories?: string[];
}

/**
 * Build the website by webpack.
 *
 ***************************************
 *
 * Add "--env envName" to command line, if you want to switch config folder dynamically.
 *
 * Add "--profile" to command line, if you want to generate a profile for analysis in project folder.
 * Then you can use visualizer to analyze: https://chrisbateman.github.io/webpack-visualizer/
 *
 * Add "--mode fast" to command line, if you want to skip style and lint checks.
 */
export class WebpackBuilder {
    private readonly projectDirectory: string;
    private readonly extraCheckDirectories: string[];
    private readonly projectStaticDirectory: string;
    private readonly projectProfilingJsonOutputPath: string;
    private readonly outputDirectory: string;
    private readonly webpackConfig: webpack.Configuration;
    private readonly isFastMode: boolean;
    private readonly enableProfiling: boolean;

    constructor(options: WebpackBuilderOptions) {
        this.projectDirectory = options.projectDirectory;
        this.extraCheckDirectories = options.extraCheckDirectories ?? [];
        this.projectStaticDirectory = path.join(this.projectDirectory, "static");
        this.projectProfilingJsonOutputPath = path.join(this.projectDirectory, "profile.json");
        this.outputDirectory = path.join(this.projectDirectory, "build/dist");
        const webpackConfigGenerator = new WebpackConfigGenerator(options);
        this.webpackConfig = webpackConfigGenerator.production(this.outputDirectory);
        this.isFastMode = webpackConfigGenerator.isFastMode;
        this.enableProfiling = webpackConfigGenerator.enableProfiling;
    }

    run() {
        new ProjectStructureChecker({
            projectDirectory: this.projectDirectory,
            extraCheckDirectories: this.extraCheckDirectories,
        }).run();

        try {
            if (!this.isFastMode) {
                this.checkCodeStyle();
            }
            this.cleanDistFolder();
            this.copyStatic();
            this.bundleByWebpack();
        } catch (e) {
            print.error(e);
            console.error(e);
            process.exit(1);
        }
    }

    private checkCodeStyle() {
        print.info(`Checking project code styles at "${path.join(this.projectDirectory, "src")}"`);
        PrettierUtil.check(path.join(this.projectDirectory, "src"));

        for (const directory of this.extraCheckDirectories) {
            print.info(`Checking extra directory code styles at "${path.join(directory, "src")}"`);
            PrettierUtil.check(path.join(directory, "src"));
        }
    }

    private cleanDistFolder() {
        print.info("Cleaning build dist folder");
        fs.emptyDirSync(this.outputDirectory);
    }

    private copyStatic() {
        print.info("Copying static assets to build dist folder");
        fs.copySync(this.projectStaticDirectory, this.outputDirectory, {dereference: true});
    }

    private bundleByWebpack() {
        print.info("Starting webpack");

        webpack(this.webpackConfig).run((error, stats: webpack.Stats) => {
            if (error) {
                print.error(error);
                console.error(error);
                process.exit(1);
            } else {
                const statsJSON = stats.toJson();

                if (this.enableProfiling) {
                    fs.writeFileSync(this.projectProfilingJsonOutputPath, JSON.stringify(statsJSON, null, 2));
                    print.info(["Generate profile for analysis", this.projectProfilingJsonOutputPath]);
                }

                if (statsJSON.errors.length) {
                    statsJSON.errors.forEach(error => {
                        print.error(error);
                        console.error(error);
                    });
                    process.exit(1);
                } else if (statsJSON.warnings.length) {
                    statsJSON.warnings.forEach(error => {
                        print.error(error);
                        console.error(error);
                    });
                    process.exit(1);
                }

                print.info("Build successfully");
            }
        });
    }
}
