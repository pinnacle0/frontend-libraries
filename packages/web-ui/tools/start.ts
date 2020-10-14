import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import {pathMap} from "../config/path-map";
import type {ImageUploadResponse} from "../src/internal/UploadUtil";

const PORT = 4455;

export default function start() {
    const config = getWebpackConfig();
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, {
        https: true,
        historyApiFallback: true,
        hot: true,
        compress: true,
        overlay: {warnings: true, errors: true},
        stats: {colors: true},
        before: app => {
            app.post("/ajax/upload", (request, response) => {
                const uploadResponse: ImageUploadResponse = {
                    imageURL: "https://homepages.cae.wisc.edu/~ece533/images/pool.png",
                    imageKey: "test",
                };
                response.json(uploadResponse);
            });
        },
    });
    server.listen(PORT, "0.0.0.0");
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
    signals.forEach(signal => {
        process.on(signal, () => {
            server.close();
            process.exit();
        });
    });
}

function getWebpackConfig(): webpack.Configuration {
    return {
        mode: "development",
        entry: pathMap.testEntryScriptFile,
        output: {
            filename: "static/js/[name].js",
            publicPath: "/",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
            modules: ["node_modules"],
            alias: {
                "@pinnacle0/web-ui": pathMap.srcDirectory,
                test: pathMap.testDirectory,
            },
        },
        devtool: "cheap-module-eval-source-map",
        optimization: {usedExports: true},
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: [pathMap.srcDirectory, pathMap.testDirectory],
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: pathMap.srcTsconfigFile,
                                transpileOnly: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(css|less)$/,
                    use: [
                        {loader: "style-loader"},
                        {loader: "css-loader"},
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {javascriptEnabled: true},
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|otf|ico|mp3|mp4|wav|mov)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "static/media/[name].[hash:8].[ext]",
                                esModule: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({template: pathMap.testIndexHtmlFile}),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.ProgressPlugin(),
            // Very important for moment locale tree-shaking test
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
        ],
    };
}
