const {checkSingleVersion} = require("pnpm-single-version");

module.exports = {
    hooks: {
        afterAllResolved: checkSingleVersion,
    },
};
