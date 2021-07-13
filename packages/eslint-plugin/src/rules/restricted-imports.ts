import {ESLintUtils} from "@typescript-eslint/experimental-utils";

export type MessageIds = "restrictedImports";

export const name = "restricted-imports";

type Option = Array<{
    path: string;
    packages: string[];
}>;

// TODO/Alvis: check if can remove
export const rule = ESLintUtils.RuleCreator(name => name)<Option, MessageIds>({
    name,
    meta: {
        type: "suggestion",
        docs: {
            description: `Whitelists specified import by folder path. Example: rule: ["error", {"packages": ["antd"], "path": "shared"}] Will only allow antd imports in file which path includes shared. `,
            category: "Best Practices",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            restrictedImports: "{{nodeSource}} can only be imported in {{path}}",
        },
        schema: {
            type: "array",
            items: {
                $ref: "#/definitions/WhitelistConfig",
            },
            definitions: {
                WhitelistConfig: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        path: {
                            type: "string",
                        },
                        packages: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                    },
                    required: ["packages", "path"],
                    title: "WhitelistConfig",
                },
            },
        },
    },
    defaultOptions: [],
    create: context => {
        return {
            ImportDeclaration(node) {
                if (context.options.length > 0) {
                    const fileName = context.getFilename();
                    const nodeSource = node.source.value!.toString();
                    const whitelistPath = context.options.find(_ => _.packages.includes(nodeSource))?.path;
                    if (whitelistPath && !fileName.includes(`/${whitelistPath}/`)) {
                        context.report({node, messageId: "restrictedImports", data: {path: whitelistPath, nodeSource}});
                    }
                }
            },
        };
    },
});
