// @ts-check

/** @type {import("./types").StylelintConfig} */
const config = {
    extends: ["stylelint-config-standard", "stylelint-config-prettier"],
    rules: {
        "no-descending-specificity": null,
    },
};

module.exports = config;
