import glob from "glob";
import path from "path";
import webpack from "webpack";
import yargs from "yargs";
import {Constant} from "../Constant";
import {ConfigChunkEntryFactory} from "./ConfigChunkEntryFactory";
import {HtmlWebpackPluginsFactory} from "./HtmlWebpackPluginsFactory";
import {Plugin} from "./Plugin";
import {Rule} from "./Rule";
import {ChunkEntry, WebpackConfigGeneratorOptions} from "./type";
import {WebpackEntryFactory} from "./WebpackEntryFactory";
import {WebpackOutputPublicUrlFactory} from "./WebpackOutputPublicUrlFactory";
import {WebpackResolveAliasFactory} from "./WebpackResolveAliasFactory";
import {WebpackResolveExtensionsFactory} from "./WebpackResolveExtensionsFactory";
import {WebpackResolveModulesFactory} from "./WebpackResolveModulesFactory";

/**
 * Generates a webpack config with sane defaults and guards
 * theconfig with additional layers of safety.
 *
 * Most errors thrown by webpack are 💩 and confusing,
 * so ConfigGenerator tries to validate as much as possible
 * and throw descriptive error messages.
 */
export class WebpackConfigGenerator {
    readonly env: string | null;
    readonly projectSrcDirectory: string;
    readonly tsconfigFilepath: string;

    readonly enableProfiling: boolean;
    readonly maxEntryPointKiloByte: number;
    readonly maxAssetKiloByte: number;
    readonly isFastMode: boolean;
    readonly containStylesheet: boolean;

    private readonly configChunkEntries: ChunkEntry[];
    private readonly entry: NonNullable<webpack.Configuration["entry"]>;
    private readonly htmlWebpackPluginInstances: NonNullable<webpack.Configuration["plugins"]>;
    private readonly outputPublicUrlSelect: {development: string; production: string};
    private readonly resolveExtensions: NonNullable<NonNullable<webpack.Configuration["resolve"]>["extensions"]>;
    private readonly resolveModules: NonNullable<NonNullable<webpack.Configuration["resolve"]>["modules"]>;
    private readonly resolveAliases: NonNullable<NonNullable<webpack.Configuration["resolve"]>["alias"]>;

    constructor(options: WebpackConfigGeneratorOptions) {
        this.env = (yargs.argv.env as string) ?? null;
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilepath = path.join(options.projectDirectory, "tsconfig.json");

        this.enableProfiling = Boolean(yargs.argv.profile);
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.isFastMode = yargs.argv.mode === "fast";
        this.containStylesheet = glob.sync("**/*.less", {cwd: this.projectSrcDirectory}).length > 0;

        this.configChunkEntries = ConfigChunkEntryFactory.generate({
            indexName: options.indexName ?? "index",
            projectSrcDirectory: this.projectSrcDirectory,
            extraChunks: options.extraChunks ?? {},
        });
        this.entry = WebpackEntryFactory.generate({
            configChunkEntries: this.configChunkEntries,
        });
        this.htmlWebpackPluginInstances = HtmlWebpackPluginsFactory.generate({
            configChunkEntries: this.configChunkEntries,
        });
        this.outputPublicUrlSelect = {
            development: "/",
            production: WebpackOutputPublicUrlFactory.generate({
                env: this.env,
                dynamicWebpackConfigResolver: options.dynamicWebpackConfigResolver,
            }),
        };
        this.resolveExtensions = WebpackResolveExtensionsFactory.generate({
            extraResolvedExtensions: options.extraResolvedPostfix,
        });
        this.resolveModules = WebpackResolveModulesFactory.generate({
            projectSrcDirectory: this.projectSrcDirectory,
        });
        this.resolveAliases = WebpackResolveAliasFactory.generate({
            env: this.env,
            dynamicConfigResolvers: options.dynamicConfigResolvers ?? [],
        });
    }

    development(): webpack.Configuration {
        this.printInfo("development");

        return {
            mode: "development",
            entry: this.entry,
            output: {
                filename: "static/js/[name].js",
                publicPath: this.outputPublicUrlSelect.development,
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
                // prettier-ignore
                rules: [
                    Rule.ts({tsconfigFilepath: this.tsconfigFilepath}),
                    Rule.stylesheet({minimize: false}),
                    Rule.image(),
                    Rule.other(),
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.moment(),
                this.isFastMode
                    ? Plugin.NONE
                    : !this.containStylesheet
                    ? Plugin.NONE
                    : Plugin.styleChecker.css({
                          projectSrcDirectory: this.projectSrcDirectory,
                      }),
                this.isFastMode
                    ? Plugin.NONE
                    : Plugin.styleChecker.ts({
                          projectSrcDirectory: this.projectSrcDirectory,
                          tsconfigFilepath: this.tsconfigFilepath,
                      }),
                Plugin.webpack.hmr(),
                Plugin.webpack.progress({enableProfiling: false}),
            ],
        };
    }

    production(outputDirectory: string): webpack.Configuration {
        this.printInfo("production");

        return {
            mode: "production",
            entry: this.entry,
            output: {
                path: outputDirectory,
                filename: this.enableProfiling
                    ? "static/js/[name].js"
                    : (chunkData: webpack.ChunkData): string => {
                          return this.configChunkEntries.find(_ => _.name === chunkData.chunk.name)!.outputFilename;
                      },
                chunkFilename: this.enableProfiling ? "static/js/[id].[name].js" : "static/js/[id].[chunkhash:8].js",
                publicPath: this.outputPublicUrlSelect.production,
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
                minimizer: [Plugin.minimizer.ts({sourceMap: true}), Plugin.minimizer.css()],
            },
            performance: {
                maxEntrypointSize: this.enableProfiling ? Number.MAX_SAFE_INTEGER : this.maxEntryPointKiloByte * 1000,
                maxAssetSize: this.maxAssetKiloByte * 1000,
                assetFilter: fileName => Constant.mediaExtensions.every(_ => !fileName.endsWith(`.${_}`)),
            },
            module: {
                // prettier-ignore
                rules: [
                    Rule.ts({tsconfigFilepath: this.tsconfigFilepath}),
                    Rule.stylesheet({minimize: true}),
                    Rule.image(),
                    Rule.other(),
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.crossOriginScriptTag(),
                Plugin.moment(),
                Plugin.fileOutput.css({enableProfiling: this.enableProfiling}),
                this.isFastMode
                    ? Plugin.NONE
                    : !this.containStylesheet
                    ? Plugin.NONE
                    : Plugin.styleChecker.css({
                          projectSrcDirectory: this.projectSrcDirectory,
                      }),
                this.isFastMode
                    ? Plugin.NONE
                    : Plugin.styleChecker.ts({
                          projectSrcDirectory: this.projectSrcDirectory,
                          tsconfigFilepath: this.tsconfigFilepath,
                      }),
                Plugin.webpack.progress({enableProfiling: this.enableProfiling}),
            ],
        };
    }

    private printInfo(select: "development" | "production"): void {
        for (const info of [
            `Webpack Config Constructed:`,
            `-- Code Checking: ${this.isFastMode ? "Minimal Check" : "Default"}`,
            `-- Env: ${this.env || "[N/A]"}`,
            `-- Src Directory: ${this.projectSrcDirectory}`,
            `-- HTML Entries: ${Object.keys(this.entry).join(" / ")}`,
            `-- Webpack Public Url: ${this.outputPublicUrlSelect[select]}`,
            `-- Dynamic Aliases: ${JSON.stringify(this.resolveAliases, null, 4)}`,
        ]) {
            console.info(info);
        }
    }
}

export type {WebpackConfigGeneratorOptions};
