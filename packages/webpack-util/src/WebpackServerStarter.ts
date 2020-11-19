import {Utility} from "@pinnacle0/devtool-util";
import path from "path";
import webpack from "webpack";
import DevServer from "webpack-dev-server";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";

const print = Utility.createConsoleLogger("WebpackServerStarter");

// prettier-ignore
export interface WebpackServerStarterOptions extends
        Pick<WebpackConfigGeneratorOptions,
            | "projectDirectory"
            | "dynamicConfigResolvers"
            | "extraChunks"
            | "extraPrioritizedResolvedExtensions"
        > {
    apiProxy: {
        target: string;
        context: string[];
    } | null;
    port: number;
}

/**
 * Start webpack dev server, by creating WebpackServerStarter instance and then run.
 *
 ***************************************
 *
 * Add "--env envName" to command line, if you want to switch config folder dynamically.
 */
export class WebpackServerStarter {
    private readonly projectDirectory: string;
    private readonly devServerConfigContentBase: string;
    private readonly port: number;
    private readonly apiProxy: {
        target: string;
        context: string[];
    } | null;
    private readonly webpackConfig: webpack.Configuration;

    constructor({projectDirectory, port, apiProxy, dynamicConfigResolvers, extraChunks, extraPrioritizedResolvedExtensions}: WebpackServerStarterOptions) {
        this.projectDirectory = projectDirectory;
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.port = port;
        this.apiProxy = apiProxy;
        this.webpackConfig = new WebpackConfigGenerator({
            projectDirectory,
            dynamicConfigResolvers,
            extraChunks,
            extraPrioritizedResolvedExtensions,
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
            proxy: this.apiProxy
                ? [
                      {
                          context: this.apiProxy.context,
                          target: this.apiProxy.target,
                          secure: false,
                          changeOrigin: true,
                      },
                  ]
                : undefined,
        });
    }
}
