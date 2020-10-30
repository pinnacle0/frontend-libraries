/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require -- using dynamic require in ts-node scripts is fine */
import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import {createPrint, runCommand} from "./util";
import {WebpackConfigGenerator, WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";

const print = createPrint("WebpackBuilder");

export interface WebpackBuilderOptions extends WebpackConfigGeneratorOptions {}

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
    private readonly workspaceRootDirectory: string;
    private readonly projectDirectory: string;
    private readonly projectStaticDirectory: string;
    private readonly projectProfilingJsonOutputPath: string;
    private readonly outputDirectory: string;
    private readonly webpackConfig: webpack.Configuration;
    private readonly isFastMode: boolean;
    private readonly enableProfiling: boolean;

    constructor(options: WebpackBuilderOptions) {
        this.workspaceRootDirectory = options.workspaceRootDirectory;
        this.projectDirectory = options.projectDirectory;
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
                // this.checkPackageDeps();
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
        // TODO: PrettierUtil.check(this.projectDirectory) + extraCheckFolders
        print.info("Checking project code styles");
        const prettierConfigFilepath = path.join(this.workspaceRootDirectory, "prettier.config.js");
        if (!(fs.existsSync(prettierConfigFilepath) && fs.statSync(prettierConfigFilepath))) {
            print.error(`Cannot find "prettier.config.js" at options.workspaceRootDirectory ("${prettierConfigFilepath}")`);
            process.exit(1);
        }
        runCommand(this.workspaceRootDirectory)(
            String.raw`yarn prettier \
            --config "${prettierConfigFilepath}" \
            --check \
            --loglevel warn \
            "${path.join(this.projectDirectory, "/src/**/*.{html,less,ts,tsx}")}"`
        );
        const workspaceSharedDirectory = path.join(this.workspaceRootDirectory, "shared");
        if (fs.existsSync(workspaceSharedDirectory) && fs.statSync(workspaceSharedDirectory)) {
            print.info("Checking shared project code styles");
            runCommand(this.workspaceRootDirectory)(
                String.raw`yarn prettier \
            --config "${prettierConfigFilepath}" \
            --check \
            --loglevel warn \
            "${path.join(workspaceSharedDirectory, "/src/**/*.{html,less,ts,tsx}")}"`
            );
        }
        const workspaceWebSharedDirectory = path.join(this.workspaceRootDirectory, "web/shared");
        if (fs.existsSync(workspaceWebSharedDirectory) && fs.statSync(workspaceWebSharedDirectory)) {
            print.info("Checking web/shared project code styles");
            runCommand(this.workspaceRootDirectory)(
                String.raw`yarn prettier \
            --config "${prettierConfigFilepath}" \
            --check \
            --loglevel warn \
            "${path.join(workspaceWebSharedDirectory, "/src/**/*.{html,less,ts,tsx}")}"`
            );
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
