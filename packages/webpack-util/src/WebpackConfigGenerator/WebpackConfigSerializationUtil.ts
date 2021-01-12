import prettyFormat from "pretty-format";
import type webpack from "webpack";

interface SerializableWebpackPluginDescriptor {
    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall";
    pluginName: string;
    pluginOptions: any;
}

export class WebpackConfigSerializationUtil {
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginConstructor: new () => T): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginConstructor: new (_: OptType) => T, options: OptType): webpack.WebpackPluginInstance;
    static serializablePlugin<OptType, T extends {apply(..._: any[]): void}>(name: string, PluginConstructor: new (_?: OptType) => T, options?: OptType): webpack.WebpackPluginInstance {
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

    static configToString(config: webpack.Configuration): string {
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
            // eslint-disable-next-line @typescript-eslint/no-var-requires -- prettier might not be installed (no peerDeps constraint)
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
