import glob from "glob";
import path from "path";
import webpack from "webpack";
import yargs from "yargs";
import {Constant} from "../Constant";
import {ConfigChunkEntryFactory} from "./ConfigChunkEntryFactory";
import {Plugin} from "./Plugin";
import {Rule} from "./Rule";
import {ChunkEntry, WebpackConfigGeneratorOptions} from "./type";
import {Utility} from "./Utility";
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
    readonly configChunkEntries: ChunkEntry[];

    readonly enableProfiling: boolean;
    readonly maxEntryPointKiloByte: number;
    readonly maxAssetKiloByte: number;
    readonly isFastMode: boolean;
    readonly containStylesheet: boolean;

    private readonly entry: {[chunkName: string]: string};
    private readonly outputPublicUrlSelect: {development: string; production: string};
    private readonly resolveExtensions: string[];
    private readonly resolveModules: string[];
    private readonly resolveAliases: {[moduleAlias: string]: string};

    constructor(options: WebpackConfigGeneratorOptions) {
        this.env = (yargs.argv.env as string) ?? null;
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilepath = path.join(options.projectDirectory, "tsconfig.json");
        this.configChunkEntries = new ConfigChunkEntryFactory({
            indexName: options.indexName ?? "index",
            projectSrcDirectory: this.projectSrcDirectory,
            extraChunks: options.extraChunks ?? {},
        }).get();

        this.enableProfiling = Boolean(yargs.argv.profile);
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.isFastMode = yargs.argv.mode === "fast";
        this.containStylesheet = glob.sync("**/*.less", {cwd: this.projectSrcDirectory}).length > 0;

        this.entry = Utility.toWebpackEntry(this.configChunkEntries);
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
                ...this.configChunkEntries.filter(Utility.isHTMLEntry).map(entry => {
                    return Plugin.fileOutput.html({entry});
                }),
                Plugin.moment(),
                this.isFastMode || !this.containStylesheet
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
                    : (chunkData: webpack.ChunkData) => {
                          const currentChunkEntry = this.configChunkEntries.find(chunkEntry => chunkEntry.name === chunkData.chunk.name);
                          const isPureJsChunk = Boolean(currentChunkEntry?.htmlPath === undefined);
                          // Backend requires the "third-party-error-handler" chunk to have a static filename
                          // Do not include a hash in the output filename if the chunk does not have htmlPath specified
                          return isPureJsChunk ? "static/js/[name].js" : "static/js/[chunkhash:8].js";
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
                ...this.configChunkEntries.filter(Utility.isHTMLEntry).map(entry => {
                    return Plugin.fileOutput.html({entry});
                }),
                Plugin.crossOriginScriptTag(),
                Plugin.moment(),
                Plugin.fileOutput.css({enableProfiling: this.enableProfiling}),
                this.isFastMode || !this.containStylesheet
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
            `-- HTML Entries: ${this.configChunkEntries.map(_ => _.name).join(" / ")}`,
            `-- Webpack Public Url: ${this.outputPublicUrlSelect[select]}`,
            `-- Dynamic Aliases: ${JSON.stringify(this.resolveAliases, null, 4)}`,
        ]) {
            console.info(info);
        }
    }
}

export type {WebpackConfigGeneratorOptions};
