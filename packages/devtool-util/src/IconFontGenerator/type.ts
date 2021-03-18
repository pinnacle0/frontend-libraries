export interface WebIconFontGeneratorOptions {
    iconComponentDirectory: string;
    staticDirectory: string;
    fontFamily?: string;
    iconfontOfficialClassName?: string; // Current default is "font_family"
}

export interface AppIconFontGeneratorOptions {
    iconComponentFile: string;
    androidFontPath: string;
    iosFontPath: string;
}
