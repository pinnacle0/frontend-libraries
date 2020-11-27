import {Constant} from "../Constant";
import {WebpackConfigSerializationUtil} from "./WebpackConfigSerializationUtil";

export class WebpackPerformanceAssetFilterFactory {
    static generate(): (filename: string) => boolean {
        return WebpackConfigSerializationUtil.implementation(
            `(filename) => ${JSON.stringify(Constant.mediaExtensions)}.every(_ => !filename.endsWith(_))`,
            (filename: string) => Constant.mediaExtensions.every(_ => !filename.endsWith(_))
            // prettier-format-preserve
        );
    }
}
