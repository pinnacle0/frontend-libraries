import fs from "fs";

export interface WebpackOutputPublicURLFactoryOptions {
    env: string | null;
    /**
     * Function to dynamically compute additional webpack config from `env`.
     * Should validates if the config contains `publicUrl` field.
     */
    dynamicWebpackConfigResolver: ((env: string) => string) | undefined;
}

export class WebpackOutputPublicURLFactory {
    static generate({env, dynamicWebpackConfigResolver}: WebpackOutputPublicURLFactoryOptions): string {
        if (!env || !dynamicWebpackConfigResolver) {
            return "/";
        }

        const dynamicWebpackConfigJsonFilepath = dynamicWebpackConfigResolver(env);

        if (!fs.existsSync(dynamicWebpackConfigJsonFilepath)) {
            throw new Error(`Cannot load dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        const dynamicWebpackConfig = require(dynamicWebpackConfigJsonFilepath);
        const publicPath: unknown = dynamicWebpackConfig.publicPath;

        if (typeof publicPath !== "string") {
            throw new Error(`"publicPath" from ${dynamicWebpackConfigJsonFilepath} is not string`);
        }

        return publicPath;
    }
}
