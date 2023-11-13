import {Utility} from "@pinnacle0/devtool-util";
import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import {ArgsUtil} from "./ArgsUtil";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";
import {ProjectStructureChecker} from "./ProjectStructureChecker";
import {TestRunner} from "./TestRunner";
import {CodeStyleChecker} from "./CodeStyleChecker";
import type {InternalCheckerOptions} from "./type";

export interface WebpackBuilderOptions extends WebpackConfigGeneratorOptions, Omit<InternalCheckerOptions, "tsconfigFilePath"> {}

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
    private readonly tsconfigFilePath: string;
    private readonly isFastMode: boolean;
    private readonly enableProfiling: boolean;
    private readonly onSuccess?: (() => void) | undefined;

    private readonly logger = Utility.createConsoleLogger("WebpackBuilder");

    constructor(options: WebpackBuilderOptions) {
        this.projectDirectory = options.projectDirectory;
        this.extraCheckDirectories = options.extraCheckDirectories ?? [];
        this.projectStaticDirectory = path.join(this.projectDirectory, "static");
        this.projectProfilingJSONOutputPath = path.join(this.projectDirectory, "profile.json");
        this.outputDirectory = path.join(this.projectDirectory, "build/dist");
        this.tsconfigFilePath = options.tsconfigFilePath ? options.tsconfigFilePath : path.join(options.projectDirectory, options.tsconfigFilename ?? "tsconfig.json");
        this.isFastMode = ArgsUtil.isFastMode();
        this.enableProfiling = ArgsUtil.profilingEnabled();
        this.onSuccess = options.onSuccess;

        this.webpackConfig = new WebpackConfigGenerator(options).production(this.outputDirectory);
    }

    run() {
        if (!this.isFastMode) {
            new ProjectStructureChecker({
                projectDirectory: this.projectDirectory,
                extraCheckDirectories: this.extraCheckDirectories,
                tsconfigFilePath: this.tsconfigFilePath,
            }).run();
            new TestRunner({
                projectDirectory: this.projectDirectory,
                extraCheckDirectories: this.extraCheckDirectories,
                tsconfigFilePath: this.tsconfigFilePath,
            }).run();
            new CodeStyleChecker({
                projectDirectory: this.projectDirectory,
                extraCheckDirectories: this.extraCheckDirectories,
                tsconfigFilePath: this.tsconfigFilePath,
            }).run();
        }
        this.cleanDistFolder();
        this.copyStatic();
        this.bundleByWebpack();
    }

    private cleanDistFolder() {
        this.logger.task("Cleaning build dist folder");
        fs.emptyDirSync(this.outputDirectory);
    }

    private copyStatic() {
        this.logger.task("Copying static assets to build dist folder");
        if (fs.existsSync(this.projectStaticDirectory)) {
            fs.copySync(this.projectStaticDirectory, this.outputDirectory, {dereference: true});
        }
    }

    private bundleByWebpack() {
        this.logger.task("Starting webpack");

        webpack(this.webpackConfig).run((error?: Error | null, stats?: webpack.Stats) => {
            if (error) {
                throw error;
            } else if (stats) {
                const statsJSON = stats.toJson();
                if (this.enableProfiling) {
                    this.logger.task(["Generating profile for analysis", this.projectProfilingJSONOutputPath]);
                    fs.writeFileSync(this.projectProfilingJSONOutputPath, JSON.stringify(statsJSON, null, 2), {encoding: "utf8"});
                }

                if (stats.hasErrors() || stats.hasWarnings()) {
                    this.logger.error("Webpack compiled with the following errors/warnings:");
                    console.error(stats.toString("errors-warnings"));
                    process.exit(1);
                }

                this.logger.info("Build successfully");

                if (this.onSuccess) {
                    this.logger.info("Running onSuccess callback");
                    this.onSuccess();
                }
            } else {
                this.logger.error("Webpack compiler `run()` returns no `error` and no `stats`, this is unexpected.");
                process.exit(1);
            }
        });
    }

    private getRawWarningsAndErrors(info: any): {warnings: any[]; errors: any[]} {
        const warnings: any[] = [];
        const errors: any[] = [];
        if (typeof info === "object" && info !== null) {
            if (Array.isArray(info.warnings)) {
                warnings.push(...info.warnings);
            }
            if (Array.isArray(info.errors)) {
                errors.push(...info.errors);
            }
            if (Array.isArray(info.children)) {
                info.children.forEach((_: any) => {
                    const childInfo = this.getRawWarningsAndErrors(_);
                    warnings.push(...childInfo.warnings);
                    errors.push(...childInfo.errors);
                });
            }
        }
        return {warnings, errors};
    }
}
