import webpack from "webpack";
import path from "path";
import DevServer from "webpack-dev-server";
import HTMLPlugin from "html-webpack-plugin";
import {ImageUploadResponse} from "../src/internal/UploadUtil";

const port = 4455;
const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");
const componentSourceBase = path.resolve(__dirname, "../src");
const testSourceBase = path.resolve(__dirname, "../test");
const testWebsiteSourceBase = path.resolve(__dirname, "../test/ui-test");
const testEntryScriptPath = testWebsiteSourceBase + "/index.tsx";
const testEntryHTMLPath = testWebsiteSourceBase + "/index.html";

const webpackConfig: webpack.Configuration = {
    mode: "development",
    entry: testEntryScriptPath,
    output: {
        filename: "static/js/[name].js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: ["node_modules"],
        alias: {
            "@pinnacle0/web-ui": componentSourceBase,
            test: testSourceBase,
        },
    },
    devtool: "cheap-module-eval-source-map",
    optimization: {usedExports: true},
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: [componentSourceBase, testWebsiteSourceBase],
                loader: "ts-loader",
                options: {
                    configFile: tsconfigPath,
                    transpileOnly: true,
                },
            },
            {
                test: /\.(css|less)$/,
                use: [
                    "style-loader",
                    "css-loader",
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
                loader: "file-loader",
                options: {
                    name: "static/media/[name].[hash:8].[ext]",
                    esModule: false,
                },
            },
        ],
    },
    plugins: [
        new HTMLPlugin({template: testEntryHTMLPath}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        // Very important for moment locale tree-shaking test
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
};

function start() {
    const server = new DevServer(webpack(webpackConfig), {
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
    server.listen(port, "0.0.0.0");
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
    signals.forEach(signal => {
        process.on(signal, () => {
            server.close();
            process.exit();
        });
    });
}

start();
