// @ts-ignore -- devtool-util/src/index.d.ts is not found inside the monorepo, so typescript reports an error.
import {Utility} from "@pinnacle0/devtool-util";
import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import {CodeStyleChecker} from "./CodeStyleChecker";
import {ProjectStructureChecker} from "./ProjectStructureChecker";
import type {InternalCheckerOptions} from "./type";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";

const print = Utility.createConsoleLogger("WebpackBuilder");

export interface WebpackBuilderOptions extends WebpackConfigGeneratorOptions, InternalCheckerOptions {}

/**
 * Build the website by webpack.
 *
 * Runs static analysis checkers before starting the webpack build (`prettier --check`, `eslint`, `stylelint`).
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
        try {
            if (!this.isFastMode) {
                new ProjectStructureChecker({
                    projectDirectory: this.projectDirectory,
                    extraCheckDirectories: this.extraCheckDirectories,
                }).run();
                new CodeStyleChecker({
                    projectDirectory: this.projectDirectory,
                    extraCheckDirectories: this.extraCheckDirectories,
                }).run();
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
