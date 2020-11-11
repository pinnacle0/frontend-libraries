import {miniCssExtractPlugin, optimizeCSSAssetsPlugin} from "./css.plugin";
import {crossOriginScriptTagPlugin, htmlPlugin} from "./html.plugin";
import {ignoreMomentLocalePlugin} from "./moment.plugin";
import {terserPlugin} from "./ts.plugin";
import {webpackHmrPlugin, webpackProgressPlugin} from "./webpack.plugin";

/**
 * Static factories to create \`webpack.config#plugins\` items.
 *
 * Plugins with similar functionality are grouped under a js object (as a namespace).
 */
export class Plugin {
    static readonly crossOriginScriptTag = crossOriginScriptTagPlugin;

    static readonly ignoreMomentLocale = ignoreMomentLocalePlugin;

    static readonly fileOutput = {
        html: htmlPlugin,
        miniCssExtract: miniCssExtractPlugin,
    } as const;

    static readonly minimizer = {
        optimizeCSSAssets: optimizeCSSAssetsPlugin,
        terser: terserPlugin,
    } as const;

    static readonly webpack = {
        hmr: webpackHmrPlugin,
        progress: webpackProgressPlugin,
    } as const;
}
