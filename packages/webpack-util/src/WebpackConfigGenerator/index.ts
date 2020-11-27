import {Utility} from "@pinnacle0/devtool-util/src";
import path from "path";
import webpack from "webpack";
import yargs from "yargs";
import {Constant} from "../Constant";
import type {EntryDescriptor, WebpackConfigGeneratorOptions} from "../type";
import {ConfigEntryDescriptorsFactory} from "./ConfigEntryDescriptorsFactory";
import {HTMLWebpackPluginsFactory} from "./HTMLWebpackPluginsFactory";
import {Plugin} from "./Plugin";
import {Rule} from "./Rule";
import {WebpackConfigSerializationUtil} from "./WebpackConfigSerializationUtil";
import {WebpackEntryFactory} from "./WebpackEntryFactory";
import {WebpackOutputPublicURLFactory} from "./WebpackOutputPublicURLFactory";
import {WebpackPerformanceAssetFilterFactory} from "./WebpackPerformanceAssetFilterFactory";
import {WebpackResolveAliasFactory} from "./WebpackResolveAliasFactory";
import {WebpackResolveExtensionsFactory} from "./WebpackResolveExtensionsFactory";
import {WebpackResolveModulesFactory} from "./WebpackResolveModulesFactory";

/**
 * Generates a webpack config with sane defaults.
 */
export class WebpackConfigGenerator {
    readonly env: string | null;
    readonly projectDirectory: string;
    readonly projectSrcDirectory: string;
    readonly tsconfigFilepath: string;

    readonly enableProfiling: boolean;
    readonly maxEntryPointKiloByte: number;
    readonly maxAssetKiloByte: number;
    readonly isFastMode: boolean;

    private readonly configEntryDescriptors: EntryDescriptor[];
    private readonly entry: NonNullable<webpack.Configuration["entry"]>;
    private readonly htmlWebpackPluginInstances: NonNullable<webpack.Configuration["plugins"]>;
    private readonly resolveExtensions: NonNullable<NonNullable<webpack.Configuration["resolve"]>["extensions"]>;
    private readonly resolveModules: NonNullable<NonNullable<webpack.Configuration["resolve"]>["modules"]>;
    private readonly resolveAliases: NonNullable<NonNullable<webpack.Configuration["resolve"]>["alias"]>;
    private readonly outputPublicPath: string;

    private readonly logger = Utility.createConsoleLogger("WebpackConfigGenerator");

    constructor(private readonly options: WebpackConfigGeneratorOptions) {
        this.env = (yargs.argv.env as string) ?? null;
        this.projectDirectory = options.projectDirectory;
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilepath = path.join(options.projectDirectory, "tsconfig.json");

        this.enableProfiling = Boolean(yargs.argv.profile);
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.isFastMode = yargs.argv.mode === "fast";

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
            dynamicWebpackConfigResolver: options.dynamicWebpackConfigResolver,
        });
        this.resolveExtensions = WebpackResolveExtensionsFactory.generate({
            extraPrioritizedResolvedExtensions: options.extraPrioritizedResolvedExtensions,
        });
        this.resolveModules = WebpackResolveModulesFactory.generate({
            projectSrcDirectory: this.projectSrcDirectory,
        });
        this.resolveAliases = WebpackResolveAliasFactory.generate({
            env: this.env,
            dynamicConfigResolvers: options.dynamicConfigResolvers ?? [],
        });

        this.logger.info("Config constructed:");
        for (const info of [
            `-- Code Checking: ${this.isFastMode ? "Minimal Check" : "Default"}`,
            `-- Env: ${this.env || "[N/A]"}`,
            `-- Src Directory: ${this.projectSrcDirectory}`,
            `-- HTML Entries: ${Object.keys(this.entry).join(" / ")}`,
            `-- Webpack Public URL: ${this.outputPublicPath}`,
            `-- Dynamic Aliases: ${JSON.stringify(this.resolveAliases, null, 4)}`,
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
                    Rule.ts({tsconfigFilepath: this.tsconfigFilepath, transpileOnly: true, experimentalWatchApi: true}),
                    Rule.stylesheet({minimize: false}),
                    Rule.image(),
                    Rule.other(),
                    // prettier-format-preserve
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.ignoreMomentLocale(),
                Plugin.webpack.hmr(),
                Plugin.webpack.progress({enableProfiling: false}),
                // prettier-format-preserve
            ],
        };
        this.logger.info("Full webpack config:");
        console.info(WebpackConfigSerializationUtil.configToString(config));
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
                    Plugin.minimizer.cssMinimizer(),
                    // prettier-format-preserve
                ],
            },
            performance: {
                maxEntrypointSize: this.enableProfiling ? Number.MAX_SAFE_INTEGER : this.maxEntryPointKiloByte * 1000,
                maxAssetSize: this.maxAssetKiloByte * 1000,
                assetFilter: WebpackPerformanceAssetFilterFactory.generate(),
            },
            module: {
                rules: [
                    Rule.ts({tsconfigFilepath: this.tsconfigFilepath, transpileOnly: this.isFastMode}),
                    Rule.stylesheet({minimize: true}),
                    Rule.image(),
                    Rule.other(),
                    // prettier-format-preserve
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.crossOriginScriptTag(),
                Plugin.ignoreMomentLocale(),
                Plugin.fileOutput.miniCssExtract({enableProfiling: this.enableProfiling}),
                ...(this.enableProfiling ? [Plugin.webpack.progress({enableProfiling: true})] : []), // disable to not bloat up CI logs
                // prettier-format-preserve
            ],
        };
        this.logger.info("Full webpack config:");
        console.info(WebpackConfigSerializationUtil.configToString(config));
        return config;
    }
}

export type {WebpackConfigGeneratorOptions};
