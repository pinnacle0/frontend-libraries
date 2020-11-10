import fs from "fs";

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
        if (!(env && dynamicWebpackConfigResolver)) {
            return "/";
        }

        const dynamicWebpackConfigJsonFilepath = dynamicWebpackConfigResolver(env);

        if (!fs.existsSync(dynamicWebpackConfigJsonFilepath)) {
            throw new Error(`Cannot load dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require -- file checked to exists in file system
        const dynamicWebpackConfig = require(dynamicWebpackConfigJsonFilepath);

        if (!("publicPath" in dynamicWebpackConfig)) {
            throw new Error(`Cannot find key "publicPath" in dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        const publicPath: any = dynamicWebpackConfig.publicPath;

        if (!(typeof publicPath === "string" && /^\/\/[\w-]+(\.[\w-]+)+\/$/.test(publicPath))) {
            throw new Error(
                [
                    `Invalid key "publicPath" in dynamicWebpackConfigJson.`,
                    `PublicPath must be type string and have pattern "//some.domain-name.com/",`,
                    `but received type (${typeof publicPath}) and value (${JSON.stringify(publicPath)}).`,
                    `env: "${env}"`,
                    `dynamicWebpackConfigJsonFilepath: "${dynamicWebpackConfigJsonFilepath}"`,
                ].join("\n")
            );
        }

        return publicPath as string;
    }
}
