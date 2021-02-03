export interface WebpackOutputPublicURLFactoryOptions {
    env: string | null;
    /**
     * Function to dynamically compute additional webpack config from `env`.
     * Should validates if the config contains `publicUrl` field.
     */
    webpackPublicPath: string | ((env: string) => string) | undefined;
}

export class WebpackOutputPublicURLFactory {
    static generate({env, webpackPublicPath}: WebpackOutputPublicURLFactoryOptions): string {
        if (!env || !webpackPublicPath) {
            return "/";
        }

        if (typeof webpackPublicPath === "string") {
            return webpackPublicPath;
        }

        return webpackPublicPath(env);
    }
}
