import {WebIconFontGeneratorOptions} from "./types";
import {WebIconFontGenerator} from "./WebIconFontGenerator";

export class IconFontGenerator {
    static Web = WebIconFontGenerator;
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- use `declare namespace` for declaration merging without code emitting, only export types / interface within namespace
export declare namespace IconFontGenerator {
    export type {WebIconFontGeneratorOptions};
}
