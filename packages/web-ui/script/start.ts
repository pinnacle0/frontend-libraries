import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import StylelintWebpackPlugin from "stylelint-webpack-plugin";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import type {ImageUploadResponse} from "../src/util/UploadUtil";

const PORT = 4455;

const directory = {
    config: path.join(__dirname, "../config"),
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),
};

const file = {
    tsconfigTestJson: path.join(directory.config, "tsconfig.test.json"),
    indexHtml: path.join(directory.test, "ui-test/index.html"),
};

const config: webpack.Configuration = {
    mode: "development",
    entry: path.join(__dirname, "../test/ui-test/index.tsx"),
    output: {
        filename: "static/js/[name].js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: ["node_modules"],
        alias: {
            "@pinnacle0/web-ui": directory.src,
            test: directory.test,
        },
    },
    devtool: "cheap-module-eval-source-map",
    optimization: {usedExports: true},
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: [directory.src, directory.test],
                use: [
                    {
                        loader: "ts-loader",
                        options: {configFile: file.tsconfigTestJson, transpileOnly: true},
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
                        options: {lessOptions: {javascriptEnabled: true}},
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|otf|ico|mp3|mp4|wav|mov)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {name: "static/media/[name].[hash:8].[ext]", esModule: false},
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({template: file.indexHtml}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        // Very important for moment locale tree-shaking test
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new StylelintWebpackPlugin({
            context: directory.src,
            files: "**/*.less",
        }),
    ],
};

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
