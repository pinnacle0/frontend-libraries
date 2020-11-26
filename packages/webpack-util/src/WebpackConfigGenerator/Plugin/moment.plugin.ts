import webpack from "webpack";

/**
 * Prevents moment locales from being bundled by importing moment
 * (moment by default imports all locales)
 * and helps reduce the final bundle size.
 *
 * To include a locale, it must be explicitly imported
 * (preferably at the entry file).
 */
export function ignoreMomentLocalePlugin(): webpack.WebpackPluginInstance {
    type IgnorePluginOptions = ConstructorParameters<typeof webpack.IgnorePlugin>[0];
    const options: IgnorePluginOptions = {
        // check dependency-request against the provided regex,
        // and exclude resource from final bundle if matched;
        // e.g. `/^\.\/locale$/` matches the dependency-request `require("./locale/" + name)`
        resourceRegExp: /^\.\/locale$/,
        // context where the dependency-request originated from;
        // e.g. `/moment$/` matches any directory ending in "moment", such as "<PROJECT_PATH>/node_modules/moment"
        contextRegExp: /moment$/,
    };
    const plugin = new webpack.IgnorePlugin(options);
    return Object.defineProperty(plugin, "toWebpackConfigGeneratorSerializableType", {
        value: () => ({
            "@@WP_CONFIG_GEN_TYPE": "WebpackPluginConstructorCall",
            pluginName: "webpack.IgnorePlugin",
            pluginOptions: options,
        }),
    });
}
