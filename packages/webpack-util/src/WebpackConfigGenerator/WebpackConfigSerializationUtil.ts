import prettyFormat from "pretty-format";
import webpack from "webpack";

export interface SerialiableWebpackPluginDescriptor {
    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall";
    pluginName: string;
    pluginOptions: any;
}

export interface SerializableImplementationDescriptor {
    "@@WP_CONFIG_GEN_TYPE": "Implementation";
    implementation: string;
}

export type SerializableType = SerialiableWebpackPluginDescriptor | SerializableImplementationDescriptor;

export class WebpackConfigSerializationUtil {
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginCtor: new () => T): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginCtor: new (_: OptType) => T, options: OptType): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginCtor: new (_?: OptType) => T, options?: OptType): webpack.WebpackPluginInstance {
        const plugin = new PluginCtor(options);
        return Object.defineProperty(plugin, "toWebpackConfigSerializableType", {
            value(): SerialiableWebpackPluginDescriptor {
                return {
                    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
                    pluginName: name,
                    pluginOptions: options,
                };
            },
        });
    }

    static implementation<T>(implDescription: string, expression: T): T {
        return Object.defineProperty(expression, "toWebpackConfigSerializableType", {
            value(): SerializableImplementationDescriptor {
                return {
                    "@@WP_CONFIG_GEN_TYPE": "Implementation",
                    implementation: implDescription,
                };
            },
        });
    }

    static configToString(config: webpack.Configuration): string {
        const strigifiedConfig = prettyFormat(config, {
            callToJSON: true,
            escapeRegex: false,
            escapeString: false,
            min: true,
            printFunctionName: false,
            plugins: [
                {
                    test(val: any) {
                        try {
                            return typeof val.toWebpackConfigSerializableType === "function";
                        } catch {
                            return false;
                        }
                    },
                    serialize(val: any, config, indentation, depth, refs, printer) {
                        const _ = val.toWebpackConfigSerializableType() as SerializableType;
                        switch (_["@@WP_CONFIG_GEN_TYPE"]) {
                            case "WebpackPluginConstructorCall":
                                return `new ${_.pluginName}(${printer(_.pluginOptions, config, indentation, depth, refs)})`;
                            case "Implementation":
                                return _.implementation;
                            default:
                                throw new Error(`Cannot serialize WebpackConfigGenerator type for printing to console. This is a bug in "@pinnacle0/webpack-util".`);
                        }
                    },
                },
            ],
        });
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires -- prettier might not be installed (no peerDeps constraint)
            const {format} = require("prettier") as typeof import("prettier");
            const formattedConfig = format("module.exports = " + strigifiedConfig, {
                arrowParens: "avoid",
                bracketSpacing: false,
                printWidth: 120,
                tabWidth: 1,
                useTabs: false,
                filepath: "webpack.config.js",
            });
            return formattedConfig;
        } catch {
            // Either prettier cannot be loaded, or formatting failed, return the unformatted config as a fallback.
            return strigifiedConfig;
        }
    }
}
