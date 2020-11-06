export interface WebIconFontGeneratorOptions {
    componentBasePath: string;
    staticPath: string;
    templatePath: string;
    cssURL?: string;
}

export interface AppIconFontGeneratorOptions {
    componentPath: string;
    androidFontPath: string;
    iosFontPath: string;
    templatePath: string;
    cssURL?: string;
}
