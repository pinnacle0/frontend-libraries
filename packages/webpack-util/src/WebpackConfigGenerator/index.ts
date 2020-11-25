import path from "path";
import webpack from "webpack";
import yargs from "yargs";
import {Constant} from "../Constant";
import type {ChunkEntry, WebpackConfigGeneratorOptions} from "../type";
import {ConfigChunkEntryFactory} from "./ConfigChunkEntryFactory";
import {HtmlWebpackPluginsFactory} from "./HtmlWebpackPluginsFactory";
import {Plugin} from "./Plugin";
import {Rule} from "./Rule";
import {WebpackEntryFactory} from "./WebpackEntryFactory";
import {WebpackOutputPublicUrlFactory} from "./WebpackOutputPublicUrlFactory";
import {WebpackResolveAliasFactory} from "./WebpackResolveAliasFactory";
import {WebpackResolveExtensionsFactory} from "./WebpackResolveExtensionsFactory";
import {WebpackResolveModulesFactory} from "./WebpackResolveModulesFactory";

declare module "webpack" {
    interface TapablePlugin {
        apply(...args: any[]): void;
    }
    /**
     * Webpack 5 bundles its own type definition file, while the whole ecosystem
     * relies on "@types/webpack" before version 5.
     * The type definition of `webpack.Plugin` does not exists in "webpack@5.0.0"
     * and DefinitelyTyped packages that depended on "@types/webpack@^4.x" breaks.
     * This is because `import webpack from "webpack"` used to resolve to
     * "@types/webpack@^4.x", but after upgrading to version 5, the import resolves
     * to "webpack@5.0.0".
     *
     * This is a workaround to allow "@types/*-plugin" packages to work before their
     * type definitions are properly upgraded.
     */
    export abstract class Plugin {
        apply(compiler: webpack.Compiler): void;
    }
}

/**
 * Generates a webpack config with sane defaults and guards
 * the config with additional layers of safety.
 *
 * Most errors thrown by webpack are 💩 and confusing,
 * so ConfigGenerator tries to validate as much as possible
 * and throw descriptive error messages.
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

    private readonly configChunkEntries: ChunkEntry[];
    private readonly entry: NonNullable<webpack.Configuration["entry"]>;
    private readonly htmlWebpackPluginInstances: NonNullable<webpack.Configuration["plugins"]>;
    private readonly outputPublicUrlSelect: {development: string; production: string};
    private readonly resolveExtensions: NonNullable<NonNullable<webpack.Configuration["resolve"]>["extensions"]>;
    private readonly resolveModules: NonNullable<NonNullable<webpack.Configuration["resolve"]>["modules"]>;
    private readonly resolveAliases: NonNullable<NonNullable<webpack.Configuration["resolve"]>["alias"]>;

    constructor(private readonly options: WebpackConfigGeneratorOptions) {
        this.env = (yargs.argv.env as string) ?? null;
        this.projectDirectory = options.projectDirectory;
        this.projectSrcDirectory = path.join(options.projectDirectory, "src");
        this.tsconfigFilepath = path.join(options.projectDirectory, "tsconfig.json");

        this.enableProfiling = Boolean(yargs.argv.profile);
        this.maxEntryPointKiloByte = options.maxEntryPointKiloByte ?? Constant.maxEntryPointKiloByte;
        this.maxAssetKiloByte = options.maxAssetKiloByte ?? Constant.maxAssetKiloByte;
        this.isFastMode = yargs.argv.mode === "fast";

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
            extraPrioritizedResolvedExtensions: options.extraPrioritizedResolvedExtensions,
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
                rules: [
                    Rule.ts({
                        enableColors: !this.enableProfiling,
                        tsconfigFilepath: this.tsconfigFilepath,
                    }),
                    Rule.stylesheet({
                        minimize: false,
                    }),
                    Rule.image(),
                    Rule.other(),
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.ignoreMomentLocale(),
                Plugin.webpack.hmr(),
                Plugin.webpack.progress({
                    enableProfiling: false,
                }),
            ],
        };
    }

    production(outputDirectory: string): webpack.Configuration {
        this.printInfo("production");

        return {
            mode: "production",
            entry: this.entry,
            target: ["web", "es5"],
            output: {
                path: outputDirectory,
                filename: this.enableProfiling
                    ? "static/js/[name].js"
                    : (pathInfo, assetInfo) => {
                          return this.configChunkEntries.find(_ => _.name === pathInfo.chunk!.name)!.outputFilename;
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
                minimizer: [
                    Plugin.minimizer.terser({
                        sourceMap: true,
                    }),
                    Plugin.minimizer.cssMinimizer(),
                ],
            },
            performance: {
                maxEntrypointSize: this.enableProfiling ? Number.MAX_SAFE_INTEGER : this.maxEntryPointKiloByte * 1000,
                maxAssetSize: this.maxAssetKiloByte * 1000,
                assetFilter: (fileName: string) => Constant.mediaExtensions.every(_ => !fileName.endsWith(_)),
            },
            module: {
                rules: [
                    Rule.ts({
                        enableColors: !this.enableProfiling,
                        tsconfigFilepath: this.tsconfigFilepath,
                    }),
                    Rule.stylesheet({
                        minimize: true,
                    }),
                    Rule.image(),
                    Rule.other(),
                ],
            },
            plugins: [
                ...this.htmlWebpackPluginInstances,
                Plugin.crossOriginScriptTag(),
                Plugin.ignoreMomentLocale(),
                Plugin.fileOutput.miniCssExtract({
                    enableProfiling: this.enableProfiling,
                }),
                Plugin.webpack.progress({
                    enableProfiling: this.enableProfiling,
                }),
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
