import HtmlWebpackPlugin from "html-webpack-plugin";
import type webpack from "webpack";

const PLUGIN_NAME = "ScriptTagCrossOriginPlugin";

// This plugin adds crossorigin="anonymous" to html-webpack-plugin generated <script> tags, only work with html-webpack-plugin@4.0.0+
export class ScriptTagCrossOriginPlugin implements webpack.WebpackPluginInstance {
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
