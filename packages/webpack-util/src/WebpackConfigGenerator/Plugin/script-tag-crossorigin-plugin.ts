import HtmlWebpackPlugin from "html-webpack-plugin";
import type webpack from "webpack";

const PLUGIN_NAME = "ScriptTagCrossOriginPlugin";

// This plugin add crossorigin="anonymous" to html-webpack-plugin generated js script tag, only work with html-webpack-plugin@4.0.0 and above
export class ScriptTagCrossOriginPlugin {
    apply(compiler: webpack.Compiler): void {
        compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            const hook = HtmlWebpackPlugin.getHooks(compilation).alterAssetTags;
            hook.tap(PLUGIN_NAME, result => {
                const {assetTags} = result;
                for (const scriptTag of assetTags.scripts) {
                    if (scriptTag.attributes?.src && /.js$/.test(scriptTag.attributes.src.toString())) {
                        scriptTag.attributes.crossorigin = "anonymous";
                    }
                }
                return result;
            });
        });
    }
}
