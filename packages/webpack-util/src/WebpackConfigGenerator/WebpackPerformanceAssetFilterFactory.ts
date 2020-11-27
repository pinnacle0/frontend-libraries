import {Constant} from "../Constant";
import {WebpackConfigGeneratorSerializableType} from "../type";

export class WebpackPerformanceAssetFilterFactory {
    static generate(): (filename: string) => boolean {
        const filter = (filename: string) => {
            return Constant.mediaExtensions.every(_ => !filename.endsWith(_));
        };
        return Object.defineProperty(filter, "toWebpackConfigGeneratorSerializableType", {
            value: (): WebpackConfigGeneratorSerializableType => ({
                "@@WP_CONFIG_GEN_TYPE": "Implementation",
                implementation: `(filename) => ${JSON.stringify(Constant.mediaExtensions)}.every(_ => !filename.endsWith(_))`,
            }),
        });
    }
}
