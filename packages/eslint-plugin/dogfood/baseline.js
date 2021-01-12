/* eslint-env node */

require("ts-node").register({
    project: require.resolve("../../../config/tsconfig.base.json"),
    transpileOnly: true,
});

module.exports = {...require("../src/config/baseline").baseline};
