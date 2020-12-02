import {Utility} from "@pinnacle0/devtool-util/src";
import path from "path";
import webpack from "webpack";
import DevServer from "webpack-dev-server";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";

export interface WebpackServerStarterOptions extends Pick<WebpackConfigGeneratorOptions, "projectDirectory" | "dynamicConfigResolvers" | "extraEntries" | "extraPrioritizedResolvedExtensions"> {
    port: number;
    apiProxy?: {
        target: string;
        context: string[];
    };
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
    private readonly apiProxy:
        | {
              target: string;
              context: string[];
          }
        | undefined;
    private readonly webpackConfig: webpack.Configuration;
    private readonly logger = Utility.createConsoleLogger("WebpackServerStarter");

    constructor({projectDirectory, port, apiProxy, dynamicConfigResolvers, extraEntries, extraPrioritizedResolvedExtensions}: WebpackServerStarterOptions) {
        this.projectDirectory = projectDirectory;
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.port = port;
        this.apiProxy = apiProxy;
        this.webpackConfig = new WebpackConfigGenerator({
            projectDirectory,
            dynamicConfigResolvers,
            extraEntries,
            extraPrioritizedResolvedExtensions,
        }).development();
    }

    run() {
        try {
            this.logger.info(["Starting dev server on port", String(this.port)]);
            const server = this.createDevServerInstance();
            server.listen(this.port, "0.0.0.0", error => {
                if (error) {
                    this.logger.error(error);
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
            this.logger.error(e);
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
                // https://github.com/webpack/webpack/blob/b65d060040a26255cbf6f50350fef4d4ffcce4d7/lib/stats/DefaultStatsPresetPlugin.js#L96-L103
                all: false,
                errors: true,
                errorsCount: true,
                warnings: true,
                warningsCount: true,
                logging: "warn",
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
