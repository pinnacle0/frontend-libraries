export class Constant {
    static readonly maxEntryPointKiloByte: number = 1500;

    static readonly maxAssetKiloByte: number = 4000;

    /**
     * List of file extensions that should be resolvable by webpack.config#resolve.extensions.
     * Extensions should begin with a dot (".").
     */
    static readonly resolveExtensions: readonly string[] = [".ts", ".tsx", ".js", ".jsx", ".less", ".css"];

    /**
     * List of font file extensions that should be bundled by webpack with file-loader.
     * Extensions should begin with a dot (".").
     */
    static readonly fontExtensions: readonly string[] = [".woff", ".woff2", ".eot", ".ttf", ".otf"];

    /**
     * List of media file extensions that should be bundled by webpack with file-loader.
     * Extensions should begin with a dot (".").
     */
    static readonly mediaExtensions: readonly string[] = [".mp3", ".mp4", ".wav", ".mov", ".flv", ".avi"];

    /**
     * List of filename candidates for webpack.config#entry.main that should reside in `<projectDirectory>/src/`.
     * Candidates placed at the front of the array has higher priority.
     */
    static readonly mainEntryFilenames: readonly string[] = ["index.tsx", "index.ts", "index.jsx", "index.js", "index.less", "index.css"];
}
