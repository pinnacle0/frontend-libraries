import prettyFormat from "pretty-format";
import type webpack from "webpack";

interface SerializableWebpackPluginDescriptor {
    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall";
    pluginName: string;
    pluginOptions: any;
}

type WebpackPluginConstructor<T> = new (options: T) => {apply(..._: any[]): void};

export class WebpackConfigSerializationUtil {
    static serializablePlugin(name: string, PluginConstructor: WebpackPluginConstructor<never>): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType>(name: string, PluginConstructor: WebpackPluginConstructor<OptType>, options: OptType): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType>(name: string, PluginConstructor: WebpackPluginConstructor<OptType | undefined>, options?: OptType): webpack.WebpackPluginInstance {
        const plugin = new PluginConstructor(options);
        return Object.defineProperty(plugin, "toWebpackConfigSerializableType", {
            value(): SerializableWebpackPluginDescriptor {
                return {
                    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
                    pluginName: name,
                    pluginOptions: options,
                };
            },
        });
    }

    static async configToString(config: webpack.Configuration): Promise<string> {
        const configString = prettyFormat(config, {
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
                        const _ = val.toWebpackConfigSerializableType() as SerializableWebpackPluginDescriptor;
                        return `new ${_.pluginName}(${printer(_.pluginOptions, config, indentation, depth, refs)})`;
                    },
                },
            ],
        });
        try {
            const {format} = require("prettier") as typeof import("prettier");
            return format("module.exports = " + configString, {
                arrowParens: "avoid",
                bracketSpacing: false,
                printWidth: 120,
                tabWidth: 1,
                useTabs: false,
                filepath: "webpack.config.js",
            });
        } catch {
            // Either prettier cannot be loaded, or formatting failed, return the unformatted config as a fallback.
            return configString;
        }
    }
}
