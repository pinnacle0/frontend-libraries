// @ts-check

/** @type {import("./types").LintStagedConfig} */
const config = {
    "*.{js,jsx,ts,tsx}": ["eslint", "prettier --write"],
    "*.{css,html,json,less,yaml,yml}": ["prettier --write"],
};

module.exports = config;
