import {Utility} from "./Utility";

export const Constant = Object.freeze({
    maxEntryPointKiloByte: 1500,
    maxAssetKiloByte: 4000,
    chunkExtensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    fontExtensions: [".woff", ".woff2", ".eot", ".ttf", ".otf"],
    mediaExtensions: [".mp3", ".mp4", ".wav", ".mov", ".flv", ".avi"],
});

Constant.chunkExtensions.forEach(Utility.validateFileExtension);
Object.freeze(Constant.chunkExtensions);

Constant.fontExtensions.forEach(Utility.validateFileExtension);
Object.freeze(Constant.fontExtensions);

Constant.mediaExtensions.forEach(Utility.validateFileExtension);
Object.freeze(Constant.mediaExtensions);
