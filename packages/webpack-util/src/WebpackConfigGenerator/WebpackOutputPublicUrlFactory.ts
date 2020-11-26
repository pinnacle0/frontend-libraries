import fs from "fs";

// TODO: naming URL
export interface WebpackOutputPublicUrlFactoryOptions {
    env: string | null;
    /**
     * Function to dynamically compute additional webpack config from `env`.
     * Should validates if the config contains `publicUrl` field.
     */
    dynamicWebpackConfigResolver: ((env: string) => string) | undefined;
}

export class WebpackOutputPublicUrlFactory {
    static generate({env, dynamicWebpackConfigResolver}: WebpackOutputPublicUrlFactoryOptions): string {
        if (!env || !dynamicWebpackConfigResolver) {
            return "/";
        }

        const dynamicWebpackConfigJsonFilepath = dynamicWebpackConfigResolver(env);

        if (!fs.existsSync(dynamicWebpackConfigJsonFilepath)) {
            throw new Error(`Cannot load dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require -- file checked to exists in file system
        const dynamicWebpackConfig = require(dynamicWebpackConfigJsonFilepath);
        const publicPath: unknown = dynamicWebpackConfig.publicPath;

        if (typeof publicPath !== "string") {
            throw new Error(`"publicPath" from ${dynamicWebpackConfigJsonFilepath} is not string`);
        }

        return publicPath;
    }
}
