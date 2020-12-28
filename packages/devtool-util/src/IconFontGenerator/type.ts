export interface WebIconFontGeneratorOptions {
    iconComponentDirectory: string;
    staticDirectory: string;
    templateDirectory: string;
    cssURL?: string;
    fontFamily?: string; // TODO: Review should we extract fontFamily from generated css
}

export interface AppIconFontGeneratorOptions {
    iconComponentDirectory: string;
    templateDirectory: string;
    androidFontPath: string;
    iosFontPath: string;
    cssURL?: string;
}
