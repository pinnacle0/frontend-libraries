import {AppIconFontGenerator} from "./AppIconFontGenerator";
import {WebIconFontGenerator} from "./WebIconFontGenerator";

export class IconFontGenerator {
    static Web = WebIconFontGenerator;
    static App = AppIconFontGenerator;
}

export type {AppIconFontGeneratorOptions, WebIconFontGeneratorOptions} from "./type";
