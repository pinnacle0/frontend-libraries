/* eslint-env node */

require("ts-node").register({
    project: require.resolve("../../../config/tsconfig.base.json"),
});

module.exports = {...require("../src/config/baseline").configBaseline};
