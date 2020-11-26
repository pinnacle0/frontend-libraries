import {Constant} from "../Constant";
import {WebpackConfigGeneratorSerializableType} from "../type";

export class WebpackPerformanceAssetFilterFactory {
    static generate(): (fileName: string) => boolean {
        const filter = (fileName: string) => {
            return Constant.mediaExtensions.every(_ => !fileName.endsWith(_));
        };
        return Object.defineProperty(filter, "toWebpackConfigGeneratorSerializableType", {
            value: (): WebpackConfigGeneratorSerializableType => ({
                "@@WP_CONFIG_GEN_TYPE": "Implementation",
                implementation: `(fileName) => ${JSON.stringify(Constant.mediaExtensions)}.every(_ => !fileName.endsWith(_))`,
            }),
        });
    }
}
