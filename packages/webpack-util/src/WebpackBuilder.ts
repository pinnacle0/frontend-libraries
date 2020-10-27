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

        webpack(this.webpackConfig).run((error?: Error, stats?: webpack.Stats) => {
            if (error) {
                print.error(error);
                console.error(error);
                process.exit(1);
            } else if (stats) {
                const statsJSON = stats.toJson() as ToJsonOutput;

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
            } else {
                process.exit(1);
            }
        });
    }
}

// Copied and pasted from @types/webpack@4.41.23
interface ChunkGroup {
    assets: string[];
    chunks: Array<number | string>;
    children: Record<
        string,
        {
            assets: string[];
            chunks: Array<number | string>;
            name: string;
        }
    >;
    childAssets: Record<string, string[]>;
    isOverSizeLimit?: boolean;
}
type ReasonType =
    | "amd define"
    | "amd require array"
    | "amd require context"
    | "amd require"
    | "cjs require context"
    | "cjs require"
    | "context element"
    | "delegated exports"
    | "delegated source"
    | "dll entry"
    | "accepted harmony modules"
    | "harmony accept"
    | "harmony export expression"
    | "harmony export header"
    | "harmony export imported specifier"
    | "harmony export specifier"
    | "harmony import specifier"
    | "harmony side effect evaluation"
    | "harmony init"
    | "import() context development"
    | "import() context production"
    | "import() eager"
    | "import() weak"
    | "import()"
    | "json exports"
    | "loader"
    | "module.hot.accept"
    | "module.hot.decline"
    | "multi entry"
    | "null"
    | "prefetch"
    | "require.context"
    | "require.ensure"
    | "require.ensure item"
    | "require.include"
    | "require.resolve"
    | "single entry"
    | "wasm export import"
    | "wasm import";
interface Reason {
    moduleId: number | string | null;
    moduleIdentifier: string | null;
    module: string | null;
    moduleName: string | null;
    type: ReasonType;
    explanation?: string;
    userRequest: string;
    loc: string;
}
interface FnModules {
    assets?: string[];
    built: boolean;
    cacheable: boolean;
    chunks: Array<number | string>;
    depth?: number;
    errors: number;
    failed: boolean;
    filteredModules?: boolean;
    id: number | string;
    identifier: string;
    index: number;
    index2: number;
    issuer: string | undefined;
    issuerId: number | string | undefined;
    issuerName: string | undefined;
    issuerPath: Array<{
        id: number | string;
        identifier: string;
        name: string;
        profile: any; // TODO
    }>;
    modules: FnModules[];
    name: string;
    optimizationBailout?: string;
    optional: boolean;
    prefetched: boolean;
    profile: any; // TODO
    providedExports?: any; // TODO
    reasons: Reason[];
    size: number;
    source?: string;
    usedExports?: boolean;
    warnings: number;
}
interface ToJsonOutput {
    _showErrors: boolean;
    _showWarnings: boolean;
    assets?: Array<{
        chunks: Array<number | string>;
        chunkNames: string[];
        emitted: boolean;
        isOverSizeLimit?: boolean;
        name: string;
        size: number;
    }>;
    assetsByChunkName?: Record<string, string | string[]>;
    builtAt?: number;
    children?: Array<ToJsonOutput & {name?: string}>;
    chunks?: Array<{
        children: number[];
        childrenByOrder: Record<string, number[]>;
        entry: boolean;
        files: string[];
        filteredModules?: number;
        hash?: string;
        id: number | string;
        initial: boolean;
        modules?: FnModules[];
        names: string[];
        origins?: Array<{
            moduleId?: string | number;
            module: string;
            moduleIdentifier: string;
            moduleName: string;
            loc: string;
            request: string;
            reasons: string[];
        }>;
        parents: number[];
        reason?: string;
        recorded?: boolean;
        rendered: boolean;
        size: number;
        siblings: number[];
    }>;
    entrypoints?: Record<string, ChunkGroup>;
    errors: string[];
    env?: Record<string, any>;
    filteredAssets?: number;
    filteredModules?: boolean;
    hash?: string;
    modules?: FnModules[];
    namedChunkGroups?: Record<string, ChunkGroup>;
    needAdditionalPass?: boolean;
    outputPath?: string;
    publicPath?: string;
    time?: number;
    version?: string;
    warnings: string[];
}
