import webpack from "webpack";
import {cssFileOutputPlugin, cssMinimizePlugin, cssStyleCheckerPlugin} from "./css.plugin";
import {crossOriginScriptTagPlugin, htmlFilePlugin} from "./html.plugin";
import {momentPlugin} from "./moment.plugin";
import {tsMinimizerPlugin, tsStyleCheckerPlugin} from "./ts.plugin";
import {webpackHmrPlugin, webpackProgressPlugin} from "./webpack.plugin";

/**
 * Does nothing. 🙂
 */
class DummyPlugin implements webpack.Plugin {
    apply() {}
}

/**
 * Static factories to create \`webpack.config#plugins\` items.
 */
export class Plugin {
    /** Does nothing, used for the "does-nothing" branch of "?:" ternary expression */
    static readonly NONE = new DummyPlugin();

    static readonly crossOriginScriptTag = crossOriginScriptTagPlugin;

    static readonly moment = momentPlugin;

    static readonly fileOutput = {
        html: htmlFilePlugin,
        css: cssFileOutputPlugin,
    } as const;

    static readonly styleChecker = {
        css: cssStyleCheckerPlugin,
        ts: tsStyleCheckerPlugin,
    } as const;

    static readonly minimizer = {
        css: cssMinimizePlugin,
        ts: tsMinimizerPlugin,
    } as const;

    static readonly webpack = {
        hmr: webpackHmrPlugin,
        progress: webpackProgressPlugin,
    } as const;
}
