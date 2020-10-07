/* eslint-env node */
// @ts-check

/** @type {Partial<import("stylelint").Configuration>} */
const config = {
    extends: ["stylelint-config-standard", "stylelint-config-prettier"],
    rules: {
        "no-descending-specificity": null,
    },
};

module.exports = config;
