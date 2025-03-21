import type {ParserOptions} from "@babel/parser";
import type {Options as GenerateOptions, print} from "recast";
import type {ASTNode, builders, visit} from "ast-types-x/";

export interface Toolkit {
    parse: (source: string) => ASTNode;
    builders: typeof builders;
    visit: typeof visit;
    generate: typeof print;
}

export interface CreateToolkitOptions {
    parse?: ParserOptions | undefined;
    generate?: GenerateOptions | undefined;
}

export type {NodePath} from "ast-types-x/node-path";

export type Transform = (source: string, toolkit: Toolkit) => string | void;

// Please do not modify this manually, use `codegen` and `new-codemod` script to automatically generate codemod list
export const Codemod = ["object-freeze-to-class-static", "use-react-hook-from-web-ui", "use-react-node", "use-react-util-from-web-ui", "use-react-redux-hooks-from-core-fe"] as const;

export type Codemod = (typeof Codemod)[number];
