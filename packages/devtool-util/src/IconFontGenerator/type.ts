export interface WebIconFontGeneratorOptions {
    iconComponentDirectory: string;
    staticDirectory: string;
    // TODO/dion: do not remove this now, i will check again
    fontFamily?: string;
}

export interface AppIconFontGeneratorOptions {
    iconComponentFile: string;
    androidFontPath: string;
    iosFontPath: string;
}
