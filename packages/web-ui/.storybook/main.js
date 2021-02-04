const path = require("path");

/** @type {import("@storybook/core/types").StorybookConfig} */
module.exports = {
    stories: [path.join(__dirname, "../**/*.stories.@(js|jsx|ts|tsx)")],

    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],

    typescript: {
        check: true,
        checkOptions: {
            eslint: true,
            eslintOptions: {
                extends: [path.join(__dirname, "../../../.eslintrc.js")],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
            tsconfig: path.join(__dirname, "../config/tsconfig.stories.json"),
        },
        reactDocgen: "react-docgen-typescript",
    },

    webpackFinal(config, options) {
        // Add path aliases (keep this in sync with tsconfig.stories.json)
        config ??= {};
        config.resolve ??= {};
        config.resolve.alias ??= {};
        Object.assign(config.resolve.alias, {
            "@pinnacle0/web-ui": path.join(__dirname, "../src"),
            "@pinnacle0/web-ui-stories": path.join(__dirname, "../stories"),
        });

        // Add loader for .less
        config.module ??= {};
        config.module.rules ??= [];
        config.module.rules.push({
            test: /\.less$/,
            use: [
                {loader: require.resolve("style-loader")},
                {loader: require.resolve("css-loader")},
                {
                    loader: require.resolve("less-loader"),
                    options: {lessOptions: {javascriptEnabled: true}},
                },
            ],
        });

        return config;
    },
};
