import {cssMinimizerPlugin, miniCssExtractPlugin} from "./css.plugin";
import {esbuildMinimizer} from "./esbuild.plugin";
import {scriptTagCrossOriginPlugin, htmlPlugin} from "./html.plugin";
import {ignoreMomentLocalePlugin} from "./moment.plugin";
import {reactRefreshPlugin, terserPlugin} from "./ts.plugin";
import {webpackDefinePlugin, webpackProgressPlugin} from "./webpack.plugin";

/**
 * Static factories to create \`webpack.config#plugins\` items.
 *
 * Plugins with similar functionality are grouped under a js object (as a namespace).
 */
export class Plugin {
    static readonly scriptTagCrossOriginPlugin = scriptTagCrossOriginPlugin;

    static readonly ignoreMomentLocale = ignoreMomentLocalePlugin;

    static readonly reactRefresh = reactRefreshPlugin;

    static readonly fileOutput = {
        html: htmlPlugin,
        miniCssExtract: miniCssExtractPlugin,
    };

    static readonly minimizer = {
        cssMinimizer: cssMinimizerPlugin,
        terser: terserPlugin,
        esbuildMinimizer,
    };

    static readonly webpack = {
        progress: webpackProgressPlugin,
        define: webpackDefinePlugin,
    };
}
