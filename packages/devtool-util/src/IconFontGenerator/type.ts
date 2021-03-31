export interface WebIconFontGeneratorOptions {
    iconComponentDirectory: string;
    staticDirectory: string;
    fontFamily?: string;
    iconfontOfficialClassName?: string;
}

export interface AppIconFontGeneratorOptions {
    iconComponentFile: string;
    androidFontPath: string;
    iosFontPath: string;
}
