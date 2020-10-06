// @ts-check

/** @type {import("./types").HuskyConfig} */
const config = {
    hooks: {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    },
};

module.exports = config;
