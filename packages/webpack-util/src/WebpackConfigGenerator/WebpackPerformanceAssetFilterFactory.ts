import {Constant} from "../Constant";

export class WebpackPerformanceAssetFilterFactory {
    static generate(): (fileName: string) => boolean {
        const filter = (fileName: string) => {
            return Constant.mediaExtensions.every(_ => !fileName.endsWith(_));
        };
        return Object.defineProperty(filter, "toWebpackConfigGeneratorSerializableType", {
            value: () => ({
                "@@WP_CONFIG_GEN_TYPE": "Implementation",
                implementation: `(fileName) => ${JSON.stringify(Constant.mediaExtensions)}.every(_ => !fileName.endsWith(_))`,
            }),
        });
    }
}
