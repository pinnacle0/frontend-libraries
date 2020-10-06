import type * as jest from "@jest/types/build/Config";
import type * as eslint from "eslint";
import type * as prettier from "prettier";
import type * as stylelint from "stylelint";

export declare type ESLintConfig = eslint.Linter.Config;
export declare type JestConfig = jest.InitialOptionsWithRootDir;
export declare type PrettierConfig = prettier.Options;
export declare type StylelintConfig = Partial<stylelint.Configuration>;

export declare interface CommitlintConfig {
    extends?: string[];
    formatter?: string;
    rules?: Record<string, any>;
    parserPreset?:
        | string
        | {
              name?: string;
              path?: string;
              parserOpts: {
                  commentChar?: string;
                  headerCorrespondence?: string[];
                  headerPattern?: RegExp;
                  issuePrefixes?: string[];
                  mergeCorrespondence?: string[];
                  mergePattern?: RegExp;
                  noteKeywords?: string[];
                  revertCorrespondence?: string[];
                  revertPattern?: RegExp;
              };
          };
    ignores?: ((commit: string) => boolean)[];
    defaultIgnores?: boolean;
    plugins?: any[];
}

export declare interface HuskyConfig {
    hooks: {
        "applypatch-msg"?: string;
        "pre-applypatch"?: string;
        "post-applypatch"?: string;
        "pre-commit"?: string;
        "pre-merge-commit"?: string;
        "prepare-commit-msg"?: string;
        "commit-msg"?: string;
        "post-commit"?: string;
        "pre-rebase"?: string;
        "post-checkout"?: string;
        "post-merge"?: string;
        "pre-push"?: string;
        "pre-receive"?: string;
        update?: string;
        "post-receive"?: string;
        "post-update"?: string;
        "reference-transaction"?: string;
        "push-to-checkout"?: string;
        "pre-auto-gc"?: string;
        "post-rewrite"?: string;
        "sendemail-validate"?: string;
        "fsmonitor-watchman"?: string;
        "p4-changelist"?: string;
        "p4-prepare-changelist"?: string;
        "p4-post-changelist"?: string;
        "p4-pre-submit"?: string;
        "post-index-change"?: string;
    };
}

export declare interface LintStagedConfig {
    [fileGlob: string]: string | string[];
}

export declare interface ProjectPathMap {
    readonly srcDirectory: string;
    readonly distDirectory: string;
    readonly testDirectory: string | null;
    readonly eslintConfig: string;
    readonly prettierConfig: string;
    readonly tsconfig: string;
    readonly packageJson: string;
}
