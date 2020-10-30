import path from "path";

// TODO: explain??
export class WebpackResolveLoaderModulesFactory {
    get(): string[] {
        return [
            "node_modules",
            // If some packages failed to hoist to the consumer project,
            // they will live inside /<CONSUMER_PROJECT>/node_modules/@pinnacle0/webpack-util/node_modules/
            // Add this to the webpackConfig.resolveLoader.modules so they can be loaded.
            //! Important: This path is relative to the /dist/ folder as it will not be replaced by tsc during compilation
            path.join(__dirname, "../../node_modules"),
        ];
    }
}
