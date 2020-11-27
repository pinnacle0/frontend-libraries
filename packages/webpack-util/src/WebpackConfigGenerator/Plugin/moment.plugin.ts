import webpack from "webpack";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

/**
 * Prevents moment locales from being bundled by importing moment
 * (moment by default imports all locales)
 * and helps reduce the final bundle size.
 *
 * To include a locale, it must be explicitly imported
 * (preferably at the entry file).
 */
export function ignoreMomentLocalePlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("webpack.IgnorePlugin", webpack.IgnorePlugin, {
        // check dependency-request against the provided regex,
        // and exclude resource from final bundle if matched;
        // e.g. `/^\.\/locale$/` matches the dependency-request `require("./locale/" + name)`
        resourceRegExp: /^\.\/locale$/,
        // context where the dependency-request originated from;
        // e.g. `/moment$/` matches any directory ending in "moment", such as "<PROJECT_PATH>/node_modules/moment"
        contextRegExp: /moment$/,
    });
}
