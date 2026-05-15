import {Utility} from "@pinnacle0/devtool-util/Utility";
import path from "path";
import type {Configuration} from "@rspack/core";
import {rspack} from "@rspack/core";
import type {Application} from "express";
import type {Configuration as DevServerConfiguration} from "@rspack/dev-server";
import {RspackDevServer} from "@rspack/dev-server";
import type {WebpackConfigGeneratorOptions} from "./type.js";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator/index.js";
import {SocksProxyAgent} from "socks-proxy-agent";
import {HttpsProxyAgent} from "https-proxy-agent";
import {SystemProxySettingsUtil} from "./SystemProxySettingsUtil.js";
import type {Agent} from "https";

export interface ApiProxyOption {
    target: string;
    context: string[];
    /**
     * Route api requests through the system proxy.
     *
     * - `true` (default): auto-detect the macOS system proxy. SOCKS5 is preferred
     *   (it forwards the hostname so rule-based clients like Shadowrocket can match
     *   DOMAIN-SUFFIX / DOMAIN-KEYWORD rules); falls back to the HTTP web-proxy slot,
     *   which is what Shadowrocket's "Set As System Proxy" toggle populates on macOS.
     * - `false`: disable the proxy entirely.
     * - `string`: an explicit proxy URL — `socks5://host:port`, `socks://host:port`,
     *   or `http://host:port`.
     *
     * Note: only HTTPS api targets are supported when the system proxy is HTTP
     * (the typical case for production APIs). For HTTP targets behind an HTTP-only
     * system proxy, configure SOCKS in macOS Network Preferences instead.
     */
    useSystemSocksProxy?: boolean | string;
}

export interface WebpackServerStarterOptions extends Pick<
    WebpackConfigGeneratorOptions,
    | "projectDirectory"
    | "dynamicPathResolvers"
    | "extraEntries"
    | "prioritizedExtensionPrefixes"
    | "defineVars"
    | "extraExtensionsForOtherRule"
    | "tsconfigFilePath"
    | "tsconfigFilename"
    | "customizedLoaders"
    | "customizedPlugins"
    | "indirectCodeExclude"
> {
    port: number;
    apiProxy?: ApiProxyOption | ApiProxyOption[];
    runtimeErrorHandler?: (error: Error) => boolean;
    interceptExpressApp?: (app: NonNullable<Application>) => void;
}

/**
 * Start webpack dev server, by creating WebpackServerStarter instance and then run.
 *
 ***************************************
 *
 * Add "--env envName" to command line, if you want to switch config folder dynamically.
 */

export class ServerStarter {
    private readonly devServerConfigContentBase: string;
    private readonly setupMiddlewares: DevServerConfiguration["setupMiddlewares"];
    private readonly port: number;
    private readonly apiProxy: DevServerConfiguration["proxy"];
    private readonly runtimeErrorHandler: true | ((error: Error) => boolean);
    private readonly logger = Utility.createConsoleLogger("WebpackServerStarter");
    private readonly rspackConfig: Configuration;

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
        customizedLoaders,
        customizedPlugins,
        indirectCodeExclude,
        runtimeErrorHandler,
    }: WebpackServerStarterOptions) {
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.runtimeErrorHandler = runtimeErrorHandler ?? true;
        this.port = port;
        this.apiProxy = apiProxy ? this.createApiProxy(apiProxy) : undefined;
        this.setupMiddlewares =
            interceptExpressApp &&
            ((middlewares, devServer) => {
                devServer.app && interceptExpressApp(devServer.app);
                return middlewares;
            });

        this.rspackConfig = new WebpackConfigGenerator({
            projectDirectory,
            dynamicPathResolvers,
            extraEntries,
            prioritizedExtensionPrefixes,
            defineVars,
            extraExtensionsForOtherRule,
            tsconfigFilePath,
            tsconfigFilename,
            customizedLoaders,
            customizedPlugins,
            indirectCodeExclude,
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
        return new RspackDevServer(
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
                compress: false, // must be "false" for proxy SSE, otherwise it will buffer the response
                hot: true,
                client: {
                    overlay: {
                        runtimeErrors: this.runtimeErrorHandler,
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
            rspack(this.rspackConfig)
        );
    }

    private createApiProxy(apiProxyOptions: ApiProxyOption | ApiProxyOption[]): DevServerConfiguration["proxy"] {
        const mapApiProxyOption = (apiProxyOption: ApiProxyOption) => ({
            agent: this.createApiProxyAgent(apiProxyOption.useSystemSocksProxy ?? true),
            context: apiProxyOption.context,
            target: apiProxyOption.target,
            secure: false,
            changeOrigin: true,
        });

        if (Array.isArray(apiProxyOptions)) {
            return apiProxyOptions.map(mapApiProxyOption);
        }
        return [mapApiProxyOption(apiProxyOptions)];
    }

    private createApiProxyAgent(useSystemProxy: string | boolean): Agent | null {
        if (useSystemProxy === false) return null;

        if (typeof useSystemProxy === "string") {
            return this.createAgentFromUrl(useSystemProxy);
        }

        const settings = SystemProxySettingsUtil.get();
        if (!settings) {
            this.logger.info(["No system proxy detected — api requests will go direct"]);
            return null;
        }

        if (settings.kind === "socks") {
            const url = `socks://${settings.server}:${settings.port}`;
            this.logger.info(["Using system SOCKS proxy:", url]);
            return new SocksProxyAgent(url);
        }
        const url = `http://${settings.server}:${settings.port}`;
        this.logger.info(["Using system HTTP proxy:", url]);
        return new HttpsProxyAgent(url);
    }

    private createAgentFromUrl(url: string): Agent {
        const {protocol} = new URL(url);
        if (protocol === "socks:" || protocol === "socks4:" || protocol === "socks5:") {
            this.logger.info(["Using SOCKS proxy:", url]);
            return new SocksProxyAgent(url);
        }
        this.logger.info(["Using HTTP proxy:", url]);
        return new HttpsProxyAgent(url);
    }
}
