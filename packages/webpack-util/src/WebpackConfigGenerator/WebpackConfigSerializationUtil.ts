import webpack from "webpack";

// TODO: also move related typing here
// TODO: do not include "@@WP_CONFIG_GEN_TYPE": "Implementation";
export class WebpackConfigSerializationUtil {
    static serializablePlugin<T extends object>(plugin: T): T {
        return plugin;
    }

    static configToString(config: webpack.Configuration): string {
        return "";
    }
}
