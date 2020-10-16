import path from "path";
import webpack from "webpack";
import DevServer from "webpack-dev-server";
import {createPrint} from "./util";
import {WebpackConfigGenerator, WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";

const print = createPrint("WebpackServerStarter");

// prettier-ignore
export interface WebpackServerStarterOptions extends Pick<WebpackConfigGeneratorOptions,
    | "projectDirectory"
    | "workspaceRootDirectory"
    | "dynamicConfigResolvers"
    | "extraChunks"
    | "extraResolvedPostfix"
> {
    port: number;
    apiProxyServer?: string;
}

/**
 * Start webpack dev server, by creating WebpackServerStarter instance and then run.
 *
 * Add "--env envName" to command line, if you want to switch config folder dynamically.
 */
export class WebpackServerStarter {
    private readonly devServerConfigContentBase: string;
    private readonly port: number;
    private readonly apiProxyServer: string;
    private readonly webpackConfig: webpack.Configuration;

    constructor({projectDirectory, workspaceRootDirectory, port, apiProxyServer = "", dynamicConfigResolvers, extraChunks, extraResolvedPostfix}: WebpackServerStarterOptions) {
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.port = port;
        this.apiProxyServer = apiProxyServer;
        this.webpackConfig = new WebpackConfigGenerator({
            projectDirectory,
            workspaceRootDirectory,
            dynamicConfigResolvers,
            extraChunks,
            extraResolvedPostfix,
        }).development();
    }

    run() {
        try {
            print.info(["Starting dev server on port", String(this.port)]);
            const server = this.createDevServerInstance();
            server.listen(this.port, "0.0.0.0", error => {
                if (error) {
                    print.error(error);
                    console.error(error);
                    process.exit(1);
                }
            });
            const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
            for (const signal of signals) {
                process.on(signal, () => {
                    server.close();
                    process.exit();
                });
            }
        } catch (e) {
            print.error(e);
            console.error(e);
            process.exit(1);
        }
    }

    private createDevServerInstance() {
        return new DevServer(webpack(this.webpackConfig), {
            contentBase: this.devServerConfigContentBase,
            https: true,
            historyApiFallback: true,
            hot: true,
            compress: true,
            overlay: {
                errors: true,
            },
            stats: {
                colors: true,
            },
            proxy: [
                {
                    context: ["/ajax", "/qr", "/file", "/third-party-game/game", "/version"],
                    target: this.apiProxyServer,
                    secure: false,
                    changeOrigin: true,
                },
            ],
        });
    }
}
