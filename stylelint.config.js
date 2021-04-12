// @ts-check

/** @type {import("stylelint").Configuration} */
module.exports = {
    extends: ["stylelint-config-standard", "stylelint-config-prettier"],
    rules: {
        "no-descending-specificity": null,
        "rule-empty-line-before": ["always", {except: ["first-nested", "after-single-line-comment"]}],
    },
};
