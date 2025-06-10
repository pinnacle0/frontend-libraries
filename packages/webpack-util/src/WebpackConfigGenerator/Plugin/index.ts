import {cssMinimizerPlugin, cssExtractPlugin} from "./css.plugin.js";
import {scriptTagCrossOriginPlugin, htmlPlugin} from "./html.plugin.js";
import {jsMinimizerPlugin, reactRefreshPlugin} from "./ts.plugin.js";
import {typeCheckerPlugin} from "./type-checker.plugin.js";
import {webpackDefinePlugin, webpackProgressPlugin} from "./webpack.plugin.js";

/**
 * Static factories to create \`webpack.config#plugins\` items.
 *
 * Plugins with similar functionality are grouped under a js object (as a namespace).
 */
export class Plugin {
    static readonly scriptTagCrossOriginPlugin = scriptTagCrossOriginPlugin;

    static readonly reactRefresh = reactRefreshPlugin;

    static readonly typeChecker = typeCheckerPlugin;

    static readonly fileOutput = {
        html: htmlPlugin,
        miniCssExtract: cssExtractPlugin,
    };

    static readonly minimizer = {
        js: jsMinimizerPlugin,
        css: cssMinimizerPlugin,
    };

    static readonly webpack = {
        progress: webpackProgressPlugin,
        define: webpackDefinePlugin,
    };
}
