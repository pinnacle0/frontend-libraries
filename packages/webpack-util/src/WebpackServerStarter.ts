import {Utility} from "@pinnacle0/devtool-util";
import path from "path";
import webpack from "webpack";
import DevServer from "webpack-dev-server";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";
import {SocksProxyAgent} from "socks-proxy-agent";
import {SystemProxySettingsUtil} from "./SystemProxySettingsUtil";
import type {Agent} from "https";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import type WebpackDevServer from "webpack-dev-server";

export interface WebpackServerStarterOptions
    extends Pick<
        WebpackConfigGeneratorOptions,
        // prettier-reserve
        "projectDirectory" | "dynamicPathResolvers" | "extraEntries" | "prioritizedExtensionPrefixes" | "defineVars" | "extraExtensionsForOtherRule" | "tsconfigFilePath" | "tsconfigFilename"
    > {
    port: number;
    apiProxy?: {
        target: string;
        context: string[];
        /**
         * Use system socks proxy for all the api requests, you can also specify a socks proxy url, eg: socks5://127.0.0.1:1086
         * Default: true
         */
        useSystemSocksProxy?: boolean | string;
    };
    interceptExpressApp?: (app: NonNullable<DevServer["app"]>) => void;
}

/**
 * Start webpack dev server, by creating WebpackServerStarter instance and then run.
 *
 ***************************************
 *
 * Add "--env envName" to command line, if you want to switch config folder dynamically.
 */

export class WebpackServerStarter {
    private readonly devServerConfigContentBase: string;
    private readonly setupMiddlewares: WebpackDevServer.Configuration["setupMiddlewares"];
    private readonly port: number;
    private readonly apiProxy: DevServer.Configuration["proxy"];
    private readonly logger = Utility.createConsoleLogger("WebpackServerStarter");
    private readonly webpackConfig: webpack.Configuration;

    constructor({
        projectDirectory,
        port,
        apiProxy,
        interceptExpressApp,
        dynamicPathResolvers,
        extraEntries,
        prioritizedExtensionPrefixes,
        defineVars,
        extraExtensionsForOtherRule,
        tsconfigFilePath,
        tsconfigFilename,
    }: WebpackServerStarterOptions) {
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.port = port;
        this.apiProxy = apiProxy
            ? [
                  {
                      agent: this.createAPISocksProxyAgent(apiProxy.useSystemSocksProxy ?? true),
                      context: apiProxy.context,
                      target: apiProxy.target,
                      secure: false,
                      changeOrigin: true,
                  },
              ]
            : undefined;
        this.setupMiddlewares =
            interceptExpressApp &&
            ((middlewares, devServer) => {
                devServer.app && interceptExpressApp(devServer.app);
                return middlewares;
            });
        this.webpackConfig = new WebpackConfigGenerator({
            projectDirectory,
            dynamicPathResolvers,
            extraEntries,
            prioritizedExtensionPrefixes,
            defineVars,
            extraExtensionsForOtherRule,
            tsconfigFilePath,
            tsconfigFilename,
        }).development();
    }

    async run() {
        try {
            this.logger.info(["Starting dev server on port", String(this.port)]);
            const server = this.createDevServerInstance();
            const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
            for (const signal of signals) {
                process.on(signal, () => {
                    // force stop webpack dev server
                    server.stopCallback(() => {});
                    process.exit();
                });
            }
            await server.start();
        } catch (e) {
            this.logger.error(e);
            console.error(e);
            process.exit(1);
        }
    }

    private createDevServerInstance() {
        return new DevServer(
            {
                host: "0.0.0.0",
                port: this.port,
                static: {
                    directory: this.devServerConfigContentBase, // it's okay if folder not exist
                },
                historyApiFallback: true,
                server: {
                    type: "https",
                },
                compress: true,
                hot: true,
                client: {
                    overlay: {
                        errors: true,
                    },
                },
                setupMiddlewares: this.setupMiddlewares,
                devMiddleware: {
                    stats: {
                        colors: true,
                        // https://github.com/webpack/webpack/blob/b65d060040a26255cbf6f50350fef4d4ffcce4d7/lib/stats/DefaultStatsPresetPlugin.js#L96-L103
                        all: false,
                        errors: true,
                        errorsCount: true,
                        warnings: true,
                        warningsCount: true,
                        logging: "warn",
                    },
                },
                proxy: this.apiProxy,
            },
            webpack(this.webpackConfig)
        );
    }

    private createAPISocksProxyAgent(useSocksProxy: string | boolean): Agent | null {
        if (useSocksProxy === false) return null;

        if (typeof useSocksProxy === "string") {
            this.logger.info(["Using socks proxy:", useSocksProxy]);
            return new SocksProxyAgent(useSocksProxy);
        }

        const settings = SystemProxySettingsUtil.get();
        if (!settings) return null;
        const url = `socks://${settings.server}:${settings.port}`;
        this.logger.info(["Using socks proxy:", url]);
        return new SocksProxyAgent(url);
    }
}
