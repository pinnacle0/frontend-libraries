// @ts-check

/** @type {import("stylelint").Config} */
export default {
    customSyntax: "postcss-less",
    extends: ["stylelint-config-standard"],
    rules: {
        "no-descending-specificity": null,
        "rule-empty-line-before": ["always", {except: ["first-nested", "after-single-line-comment"]}],
        "no-invalid-position-at-import-rule": null,
        "declaration-block-no-redundant-longhand-properties": null,
        "property-no-vendor-prefix": null,
    },
};
