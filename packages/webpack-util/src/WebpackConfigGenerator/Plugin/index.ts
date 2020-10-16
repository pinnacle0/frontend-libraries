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

export const Plugin = Object.freeze({
    NONE: new DummyPlugin(),
    crossOriginScriptTag: crossOriginScriptTagPlugin,
    moment: momentPlugin,
    fileOutput: {
        html: htmlFilePlugin,
        css: cssFileOutputPlugin,
    },
    styleChecker: {
        css: cssStyleCheckerPlugin,
        ts: tsStyleCheckerPlugin,
    },
    minimizer: {
        css: cssMinimizePlugin,
        ts: tsMinimizerPlugin,
    },
    webpack: {
        hmr: webpackHmrPlugin,
        progress: webpackProgressPlugin,
    },
});
