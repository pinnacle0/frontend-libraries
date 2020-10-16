import type webpack from "webpack";
import {Utility} from "../Utility";
import {StylesheetLoader as Loader} from "./stylesheet.loader";

interface StylesheetRuleDeps {
    minimize: boolean;
}

export function stylesheetRule({minimize}: StylesheetRuleDeps): webpack.RuleSetRule {
    const use: webpack.RuleSetLoader[] = minimize
        ? [
              Loader.miniCssExtractPluginLoader(),
              Loader.cssLoader(2),
              Loader.postcssLoader(),
              Loader.lessLoader(),
              //
          ]
        : [
              Loader.styleLoader(),
              Loader.cssLoader(1),
              Loader.lessLoader(),
              //
          ];

    return {
        test: Utility.regExpForFileExtension(".css", ".less"),
        use,
        // Declare all css/less imports as side effects (not to be considered
        // as dead code), regardless of the containing package claims to be
        // otherwise. This prevents css from being tree shaken.
        // Currently webpack does not add a warning / throw an error for this.
        // See: https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
    };
}
