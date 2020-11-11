import webpack from "webpack";

interface Webpack5CompatibleIgnorePlugin {
    new (options: {resourceRegExp: RegExp; contextRegExp: RegExp}): webpack.Plugin;
    new (options: {checkResource: (resource: any, context: any) => boolean}): webpack.Plugin;
}

/**
 * Provide better typing for webpack.IgnorePlugin
 * because type signature is changed in webpack5: https://webpack.js.org/plugins/ignore-plugin/
 * Can be removed after @types/webpack includes the correct definition instead of having `any` as constructor arguments
 */
const Webpack5IgnorePlugin: Webpack5CompatibleIgnorePlugin = webpack.IgnorePlugin;

/**
 * Prevents moment locales from being bundled by importing moment
 * (moment by default imports all locales)
 * and helps reduce the final bundle size.
 *
 * To include a locale, it must be explicitly imported
 * (preferably at the entry file).
 */
export function ignoreMomentLocalePlugin() {
    return new Webpack5IgnorePlugin({
        // check dependency-request against the provided regex,
        // and exclude resource from final bundle if matched;
        // e.g. `/^\.\/locale$/` matches the dependency-request `require("./locale/" + name)`
        resourceRegExp: /^\.\/locale$/,
        // context where the dependency-request originated from;
        // e.g. `/moment$/` matches any directory ending in "moment", such as "<PROJECT_PATH>/node_modules/moment"
        contextRegExp: /moment$/,
    });
}
