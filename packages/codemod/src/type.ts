import type {ParseResult} from "@babel/parser";
import type * as t from "@babel/types";
import type traverse from "@babel/traverse";
import type generate from "@babel/generator";

export interface API {
    parse: (source: string) => ParseResult<t.File>;
    builder: typeof t;
    traverse: typeof traverse;
    generate: typeof generate;
}

export type Transform = (source: string, api: API) => string | undefined;
