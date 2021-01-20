// @ts-check

/** @type {import("stylelint").Configuration} */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-config-prettier"],
    rules: {
        "no-descending-specificity": null,
    },
};
