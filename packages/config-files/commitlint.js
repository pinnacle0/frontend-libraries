// @ts-check

const RuleSeverity = {
    Disabled: 0,
    Warning: 1,
    Error: 2,
};

/** @type {import("./types").CommitlintConfig} */
const config = {
    extends: ["@commitlint/config-conventional"],
    parserPreset: {
        parserOpts: {
            headerPattern: /\[(.*)\]: ([\w-]+(?=: ))?(.+)$/,
            headerCorrespondence: ["type", "scope", "subject"],
        },
    },
    rules: {
        "type-case": [RuleSeverity.Error, "always", "upper-case"],
        "type-enum": [
            RuleSeverity.Error,
            "always",
            [
                "CHORE",
                "FEATURE",
                "FIX",
                "FORMAT",
                "REFACTOR",
                "REVERT",
                "REVIEW",
                "TEST",
                "TODO",
                "UPGRADE",
                "NEED_TO_REVERT",
                // prettier-format-preserve
            ],
        ],
        "scope-case": [RuleSeverity.Error, "always", "lower-case"],
        "subject-case": [RuleSeverity.Error, "always", "sentence-case"],
        "header-max-length": [RuleSeverity.Warning, "always", 100],
        "body-max-length": [RuleSeverity.Warning, "always", 100],
        "footer-max-line-length": [RuleSeverity.Warning, "always", 100],
    },
};

module.exports = config;
