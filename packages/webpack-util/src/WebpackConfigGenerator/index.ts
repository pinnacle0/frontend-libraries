import {Utility} from "@pinnacle0/devtool-util/Utility";
import path from "path";
import type {Configuration} from "@rspack/core";
import {Constant} from "../Constant.js";
import {ArgsUtil} from "../ArgsUtil.js";
import type {EntryDescriptor, GeneratorLoader, GeneratorPlugin, WebpackConfigGeneratorOptions} from "../type.js";
import {ConfigEntryDescriptorsFactory} from "./ConfigEntryDescriptorsFactory.js";
import {HTMLWebpackPluginsFactory} from "./HTMLWebpackPluginsFactory.js";
import {WebpackConfigSerializationUtil} from "./WebpackConfigSerializationUtil.js";
import {WebpackEntryFactory} from "./WebpackEntryFactory.js";
import {WebpackOutputPublicURLFactory} from "./WebpackOutputPublicURLFactory.js";
import {WebpackResolveAliasFactory} from "./WebpackResolveAliasFactory.js";
import {WebpackResolveExtensionsFactory} from "./WebpackResolveExtensionsFactory.js";
import {WebpackResolveModulesFactory} from "./WebpackResolveModulesFactory.js";
import {Plugin} from "./Plugin/index.js";
import {Rule} from "./Rule/index.js";

/**
 * Generates a webpack config with sane defaults.
 */
export class WebpackConfigGenerator {
    private readonly env: string | null;
    private readonly projectSrcDirectory: string;
    private readonly tsconfigFilePath: string;
    private readonly enableProfiling: boolean;
    private readonly maxEntryPointKiloByte: number;
    private readonly maxAssetKiloByte: number;
    private readonly isFastMode: boolean;
    private readonly verbose: boolean;
    private readonly defineVars: {[key: string]: string};
    private readonly extraExtensionsForOtherRule: string[];
    private readonly customizedLoaders: GeneratorLoader[];
    private readonly customizedPlugins: GeneratorPlugin[];

    private readonly configEntryDescriptors: EntryDescriptor[];
    private readonly entry: NonNullable<Configuration["entry"]>;
    private readonly htmlWebpackPluginInstances: NonNullable<Configuration["plugins"]>;
    private readonly resolveExtensions: NonNullable<NonNullable<Configuration["resolve"]>["extensions"]>;
    private readonly resolveModules: NonNullable<NonNullable<Configuration["resolve"]>["modules"]>;
    private readonly resolveAliases: NonNullable<NonNullable<Configuration["resolve"]>["alias"]>;
    private readonly outputPublicPath: string;
    private readonly indirectCodeExclude: RegExp[];

    private readonly logger = Utility.createConsoleLogger("WebpackConfigGenerator");

    constructor(options: WebpackConfigGeneratorOptions) {
        this.env = ArgsUtil.currentEnv();
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilePath = options.tsconfigFilePath ? options.tsconfigFilePath : path.join(options.projectDirectory, options.tsconfigFilename ?? "tsconfig.json");
        this.enableProfiling = ArgsUtil.profilingEnabled();
        this.isFastMode = ArgsUtil.isFastMode();
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.verbose = options.verbose || false;
        this.defineVars = options.defineVars || {};
        this.extraExtensionsForOtherRule = options.extraExtensionsForOtherRule || [];
        this.customizedLoaders = options.customizedLoaders || [];
        this.customizedPlugins = options.customizedPlugins || [];

        this.configEntryDescriptors = ConfigEntryDescriptorsFactory.generate({
            indexName: options.indexName || "index",
            projectSrcDirectory: this.projectSrcDirectory,
            extraEntries: options.extraEntries || {},
        });
        this.entry = WebpackEntryFactory.generate({
            configEntryDescriptors: this.configEntryDescriptors,
        });
        this.htmlWebpackPluginInstances = HTMLWebpackPluginsFactory.generate({
            configEntryDescriptors: this.configEntryDescriptors,
        });
        this.outputPublicPath = WebpackOutputPublicURLFactory.generate({
            env: this.env,
            webpackPublicPath: options.webpackPublicPath,
        });
        this.resolveExtensions = WebpackResolveExtensionsFactory.generate({
            prioritizedExtensionPrefixes: options.prioritizedExtensionPrefixes,
        });
        this.resolveModules = WebpackResolveModulesFactory.generate({
            projectSrcDirectory: this.projectSrcDirectory,
        });
        this.resolveAliases = WebpackResolveAliasFactory.generate({
            env: this.env,
            resolvers: options.dynamicPathResolvers ?? [],
        });
        this.indirectCodeExclude = options.indirectCodeExclude || [];

        this.logger.info("Config constructed:");
        for (const info of [
            `-- Code Checking: ${this.isFastMode ? "Minimal Check" : "Default"}`,
            `-- Env: ${this.env || "[N/A]"}`,
            `-- Src Directory: ${this.projectSrcDirectory}`,
            `-- HTML Entries: ${Object.keys(this.entry).join(" / ")}`,
            `-- Webpack Public URL: ${this.outputPublicPath}`,
            `-- Dynamic Aliases: ${JSON.stringify(this.resolveAliases, null, 4)}`,
            `-- Use Cache: ${this.env === null}`,
        ]) {
            console.info(info);
        }
    }

    development(): Configuration {
        const config: Configuration = {
            mode: "development",
            entry: this.entry,
            target: "web", // https://github.com/webpack/webpack-dev-server/issues/2758 Hot-reload will break if we provide list to target
            output: {
                module: true,
                filename: "static/js/[name].js",
                publicPath: "/",
            },
            resolve: {
                extensions: this.resolveExtensions,
                modules: this.resolveModules,
                alias: this.resolveAliases,
            },
            devtool: "inline-cheap-module-source-map",
            optimization: {
                usedExports: true,
                splitChunks: {
                    automaticNameDelimiter: "-",
                    maxAsyncRequests: 30,
                },
            },
            module: {
                rules: [
                    Rule.ts({fastRefresh: true}),
                    Rule.stylesheet({minimize: false}),
                    Rule.image(),
                    Rule.other({extraExtensionsForOtherRule: this.extraExtensionsForOtherRule}),
                    ...this.customizedLoaders,
                ],
            },
            experiments: {
                outputModule: true,
                css: true,
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.reactRefresh(this.indirectCodeExclude),
                Plugin.webpack.progress({enableProfiling: false}),
                Plugin.webpack.define(this.defineVars),
                ...this.customizedPlugins,
            ],
            // ref: https://rspack.dev/misc/planning/roadmap#persistent-cache-support
            // rspack currently do not support persistent cache
            cache: this.env === null,
        };
        if (this.verbose || ArgsUtil.verbose()) {
            this.logger.info("Full rspack config:");
            WebpackConfigSerializationUtil.configToString(config).then(console.info);
        }
        return config;
    }

    production(outputDirectory: string): Configuration {
        const config: Configuration = {
            mode: "production",
            entry: this.entry,
            target: ["web", "es5"],
            output: {
                path: outputDirectory,
                filename: this.enableProfiling ? "static/js/[name].js" : pathInfo => this.configEntryDescriptors.find(_ => _.name === pathInfo.chunk!.name)!.outputFilename,
                chunkFilename: this.enableProfiling ? "static/js/[id].[name].js" : "static/js/[id].[contenthash:8].js",
                publicPath: this.outputPublicPath,
                crossOriginLoading: "anonymous",
            },
            resolve: {
                extensions: this.resolveExtensions,
                modules: this.resolveModules,
                alias: this.resolveAliases,
            },
            bail: true,
            optimization: {
                splitChunks: {
                    automaticNameDelimiter: "-",
                    maxAsyncRequests: 30,
                },
                minimizer: [Plugin.minimizer.js(), Plugin.minimizer.css()],
            },
            performance: {
                maxEntrypointSize: this.enableProfiling ? Number.MAX_SAFE_INTEGER : this.maxEntryPointKiloByte * 1000,
                maxAssetSize: this.maxAssetKiloByte * 1000,
                assetFilter: (filename: string) => Constant.mediaExtensions.concat(this.extraExtensionsForOtherRule).every(_ => !filename.endsWith(_)),
            },
            module: {
                rules: [Rule.ts(), Rule.stylesheet({minimize: true}), Rule.image(), Rule.other({extraExtensionsForOtherRule: this.extraExtensionsForOtherRule}), ...this.customizedLoaders],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.scriptTagCrossOriginPlugin(),
                Plugin.typeChecker({tsconfigFilePath: this.tsconfigFilePath}),
                Plugin.fileOutput.miniCssExtract({enableProfiling: this.enableProfiling}),
                ...(this.enableProfiling ? [Plugin.webpack.progress({enableProfiling: true})] : []), // disable to not bloat up CI logs
                Plugin.webpack.define(this.defineVars),
                ...this.customizedPlugins,
            ],
        };
        if (this.verbose || ArgsUtil.verbose()) {
            this.logger.info("Full webpack config:");
            WebpackConfigSerializationUtil.configToString(config).then(console.info);
        }
        return config;
    }
}

export type {WebpackConfigGeneratorOptions};
