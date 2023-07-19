import {Utility} from "@pinnacle0/devtool-util";
import path from "path";
import type webpack from "webpack";
import {Constant} from "../Constant";
import {CoreUtil} from "../CoreUtil";
import type {EntryDescriptor, WebpackConfigGeneratorOptions} from "../type";
import {ConfigEntryDescriptorsFactory} from "./ConfigEntryDescriptorsFactory";
import {HTMLWebpackPluginsFactory} from "./HTMLWebpackPluginsFactory";
import {WebpackConfigSerializationUtil} from "./WebpackConfigSerializationUtil";
import {WebpackEntryFactory} from "./WebpackEntryFactory";
import {WebpackOutputPublicURLFactory} from "./WebpackOutputPublicURLFactory";
import {WebpackResolveAliasFactory} from "./WebpackResolveAliasFactory";
import {WebpackResolveExtensionsFactory} from "./WebpackResolveExtensionsFactory";
import {WebpackResolveModulesFactory} from "./WebpackResolveModulesFactory";
import {Plugin} from "./Plugin";
import {Rule} from "./Rule";

/**
 * Generates a webpack config with sane defaults.
 */
export class WebpackConfigGenerator {
    private readonly env: string | null;
    private readonly projectDirectory: string;
    private readonly projectSrcDirectory: string;
    private readonly tsconfigFilePath: string;
    private readonly enableProfiling: boolean;
    private readonly maxEntryPointKiloByte: number;
    private readonly maxAssetKiloByte: number;
    private readonly isFastMode: boolean;
    private readonly verbose: boolean;
    private readonly defineVars: {[key: string]: string};
    private readonly extraExtensionsForOtherRule: string[];

    private readonly configEntryDescriptors: EntryDescriptor[];
    private readonly entry: NonNullable<webpack.Configuration["entry"]>;
    private readonly htmlWebpackPluginInstances: NonNullable<webpack.Configuration["plugins"]>;
    private readonly resolveExtensions: NonNullable<NonNullable<webpack.Configuration["resolve"]>["extensions"]>;
    private readonly resolveModules: NonNullable<NonNullable<webpack.Configuration["resolve"]>["modules"]>;
    private readonly resolveAliases: NonNullable<NonNullable<webpack.Configuration["resolve"]>["alias"]>;
    private readonly outputPublicPath: string;

    private readonly logger = Utility.createConsoleLogger("WebpackConfigGenerator");

    constructor(readonly options: WebpackConfigGeneratorOptions) {
        this.env = CoreUtil.currentEnv();
        this.projectDirectory = options.projectDirectory;
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilePath = options.tsconfigFilePath ? options.tsconfigFilePath : path.join(options.projectDirectory, options.tsconfigFilename ?? "tsconfig.json");

        this.enableProfiling = CoreUtil.profilingEnabled();
        this.isFastMode = CoreUtil.isFastMode();
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.verbose = options.verbose || false;
        this.defineVars = options.defineVars || {};
        this.extraExtensionsForOtherRule = options.extraExtensionsForOtherRule || [];

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

    development(): webpack.Configuration {
        const config: webpack.Configuration = {
            mode: "development",
            entry: this.entry,
            target: "web", // https://github.com/webpack/webpack-dev-server/issues/2758 Hot-reload will break if we provide list to target
            output: {
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
                    // prettier-format-preserve
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.reactRefresh(),
                Plugin.webpack.progress({enableProfiling: false}),
                Plugin.webpack.define(this.defineVars),
                // prettier-format-preserve
            ],
            cache:
                this.env === null
                    ? {
                          type: "filesystem",
                          cacheDirectory: path.join(this.projectDirectory, ".webpack-cache"),
                      }
                    : false,
        };
        if (this.verbose || CoreUtil.verbose()) {
            this.logger.info("Full webpack config:");
            WebpackConfigSerializationUtil.configToString(config).then(console.info);
        }
        return config;
    }

    production(outputDirectory: string): webpack.Configuration {
        const config: webpack.Configuration = {
            mode: "production",
            entry: this.entry,
            target: ["web", "es5"],
            output: {
                path: outputDirectory,
                filename: this.enableProfiling ? "static/js/[name].js" : pathInfo => this.configEntryDescriptors.find(_ => _.name === pathInfo.chunk!.name)!.outputFilename,
                chunkFilename: this.enableProfiling ? "static/js/[id].[name].js" : "static/js/[id].[chunkhash:8].js",
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
                minimizer: [
                    Plugin.minimizer.terser({sourceMap: true}),
                    Plugin.minimizer.css(),
                    // prettier-format-preserve
                ],
            },
            performance: {
                maxEntrypointSize: this.enableProfiling ? Number.MAX_SAFE_INTEGER : this.maxEntryPointKiloByte * 1000,
                maxAssetSize: this.maxAssetKiloByte * 1000,
                assetFilter: (filename: string) => Constant.mediaExtensions.concat(this.extraExtensionsForOtherRule).every(_ => !filename.endsWith(_)),
            },
            module: {
                rules: [
                    // prettier-format-preserve
                    Rule.ts(),
                    Rule.stylesheet({minimize: true}),
                    Rule.image(),
                    Rule.other({extraExtensionsForOtherRule: this.extraExtensionsForOtherRule}),
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.scriptTagCrossOriginPlugin(),
                Plugin.typeChecker({tsconfigFilePath: this.tsconfigFilePath}),
                Plugin.fileOutput.miniCssExtract({enableProfiling: this.enableProfiling}),
                ...(this.enableProfiling ? [Plugin.webpack.progress({enableProfiling: true})] : []), // disable to not bloat up CI logs
                Plugin.webpack.define(this.defineVars),
                // prettier-format-preserve
            ],
        };
        if (this.verbose || CoreUtil.verbose()) {
            this.logger.info("Full webpack config:");
            WebpackConfigSerializationUtil.configToString(config).then(console.info);
        }
        return config;
    }
}

export type {WebpackConfigGeneratorOptions};
