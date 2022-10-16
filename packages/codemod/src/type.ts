import type {ParserOptions} from "@babel/parser";
import type {Options as GenerateOptions, print} from "recast";
import type {ASTNode, builders, visit} from "ast-types";

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

export type {NodePath} from "ast-types/lib/node-path";

export type Transform = (source: string, toolkit: Toolkit) => string | void;

export const Codemod = ["use-react-hook-from-web-ui", "use-react-util-from-web-ui", "object-freeze-to-class-static"] as const;

export type Codemod = typeof Codemod[number];
