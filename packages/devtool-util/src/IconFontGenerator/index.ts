import {AppIconFontGenerator} from "./AppIconFontGenerator";
import {WebIconFontGenerator} from "./WebIconFontGenerator";

// TODO: Object.freeze usage
export class IconFontGenerator {
    static Web = WebIconFontGenerator;
    static App = AppIconFontGenerator;
}
