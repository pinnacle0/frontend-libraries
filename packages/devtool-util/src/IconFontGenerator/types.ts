export interface WebIconFontGeneratorOptions {
    componentBasePath: string;
    staticPath: string;
    templatePath: string;
    cssURL?: string;
    fontFamily?: string; // TODO: Review should we extract fontFamily from generated css
}

export interface AppIconFontGeneratorOptions {
    componentPath: string;
    androidFontPath: string;
    iosFontPath: string;
    templatePath: string;
    cssURL?: string;
}
