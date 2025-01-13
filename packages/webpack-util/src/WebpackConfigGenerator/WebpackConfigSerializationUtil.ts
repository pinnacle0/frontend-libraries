import {format as prettyFormat} from "pretty-format";
import {Biome} from "@biomejs/js-api";
import type {RspackPluginInstance, Configuration} from "@rspack/core";

interface SerializableWebpackPluginDescriptor {
    "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall";
    pluginName: string;
    pluginOptions: any;
}

type WebpackPluginConstructor<T> = new (options: T) => {apply(..._: any[]): void};

export class WebpackConfigSerializationUtil {
    static serializablePlugin(name: string, PluginConstructor: WebpackPluginConstructor<never>): RspackPluginInstance;
    static serializablePlugin<OptType>(name: string, PluginConstructor: WebpackPluginConstructor<OptType>, options: OptType): RspackPluginInstance;

    static serializablePlugin<OptType>(name: string, PluginConstructor: WebpackPluginConstructor<OptType | undefined>, options?: OptType): RspackPluginInstance {
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

    static async configToString(config: Configuration): Promise<string> {
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

        const biome = await Biome.create({distribution: 1});
        biome.applyConfiguration({javascript: {formatter: {enabled: true, indentStyle: "space", indentWidth: 1}}});
        return biome.formatContent("export default " + configString, {filePath: "webpack.config.js"}).content;
    }
}
