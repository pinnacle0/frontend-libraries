module.exports = {
    hooks: {
        afterAllResolved: (() => {
            try {
                require.resolve("pnpm-single-version");
                return require("pnpm-single-version").checkSingleVersion;
            } catch {
                return;
            }
        })(),
    },
};
