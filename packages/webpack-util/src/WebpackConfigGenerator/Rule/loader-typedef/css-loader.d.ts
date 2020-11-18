// TODO: remove this folder
import webpack from "webpack";

export declare interface CssLoader extends webpack.RuleSetLoader {
    loader: "css-loader";
    options?: {
        url?: boolean | Function;
        import?: boolean | Function;
        modules?:
            | boolean
            | "local"
            | "global"
            | "pure"
            | {
                  compileType: "module" | "icss";
                  auto: RegExp | Function | boolean;
                  mode: "local" | "global" | "pure" | Function;
                  localIdentName?: string;
                  localIdentContext?: string;
                  localIdentHashPrefix?: string;
                  localIdentRegExp?: string | RegExp;
                  getLocalIdent?: Function;
                  namedExport?: boolean;
                  exportGlobals?: boolean;
                  exportLocalsConvention?: "asIs" | "camelCase" | "camelCaseOnly" | "dashes" | "dashesOnly";
                  exportOnlyLocals?: boolean;
              };
        sourceMap?: boolean;
        importLoaders?: boolean | string | number;
        esModule?: boolean;
    };
}
