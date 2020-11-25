// @ts-ignore -- devtool-util/src/index.d.ts is not found inside the monorepo, so typescript reports an error.
import {Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import {CodeStyleChecker} from "./CodeStyleChecker";
import {ProjectStructureChecker} from "./ProjectStructureChecker";
import type {InternalCheckerOptions} from "./type";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";

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
    private readonly projectProfilingJSONOutputPath: string;
    private readonly outputDirectory: string;
    private readonly webpackConfig: webpack.Configuration;
    private readonly isFastMode: boolean;
    private readonly enableProfiling: boolean;

    private readonly logger = Utility.createConsoleLogger("WebpackBuilder");

    constructor(options: WebpackBuilderOptions) {
        this.projectDirectory = options.projectDirectory;
        this.extraCheckDirectories = options.extraCheckDirectories ?? [];
        this.projectStaticDirectory = path.join(this.projectDirectory, "static");
        this.projectProfilingJSONOutputPath = path.join(this.projectDirectory, "profile.json");
        this.outputDirectory = path.join(this.projectDirectory, "build/dist");
        const webpackConfigGenerator = new WebpackConfigGenerator(options);
        this.webpackConfig = webpackConfigGenerator.production(this.outputDirectory);
        this.isFastMode = webpackConfigGenerator.isFastMode;
        this.enableProfiling = webpackConfigGenerator.enableProfiling;
    }

    run() {
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
    }

    private cleanDistFolder() {
        this.logger.info("Cleaning build dist folder");
        fs.emptyDirSync(this.outputDirectory);
    }

    private copyStatic() {
        this.logger.info("Copying static assets to build dist folder");
        fs.copySync(this.projectStaticDirectory, this.outputDirectory, {dereference: true});
    }

    private bundleByWebpack() {
        this.logger.info("Starting webpack");

        webpack(this.webpackConfig).run((error?: Error, stats?: webpack.Stats) => {
            if (error) {
                throw error;
            } else if (stats) {
                const statsJSON = stats.toJson();

                if (this.enableProfiling) {
                    fs.writeFileSync(this.projectProfilingJSONOutputPath, JSON.stringify(statsJSON, null, 2));
                    this.logger.info(["Generate profile for analysis", this.projectProfilingJSONOutputPath]);
                }

                if (stats.hasErrors() || stats.hasWarnings()) {
                    const {warnings, errors} = this.getWarningsAndErrors(statsJSON);
                    this.logger.error("Webpack compiled with the following warnings:");
                    console.error(JSON.stringify(warnings, null, 2));
                    console.error();
                    this.logger.error("Webpack compiled with the following errors:");
                    console.error(JSON.stringify(errors, null, 2));
                    console.error();
                    process.exit(1);
                }

                this.logger.info("Build successfully");
            } else {
                this.logger.error("Webpack compiler `run()` returns no `error` and no `stats`, this is unexpected.");
                process.exit(1);
            }
        });
    }

    private getWarningsAndErrors(info: any): {warnings: any[]; errors: any[]} {
        const warnings: any[] = [];
        const errors: any[] = [];
        if (typeof info === "object" && info !== null) {
            if (Array.isArray(info.warnings)) {
                warnings.push(...info.warnings);
            }
            if (Array.isArray(info.errors)) {
                errors.push(...errors);
            }
            if (Array.isArray(info.children)) {
                info.children.forEach((_: any) => {
                    const childInfo = this.getWarningsAndErrors(_);
                    warnings.push(...childInfo.warnings);
                    errors.push(...childInfo.errors);
                });
            }
        }
        return {warnings, errors};
    }
}
