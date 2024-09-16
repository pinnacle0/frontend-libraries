import {WebpackBuilder} from "./WebpackBuilder";
import {rspackServerStarter} from "./WebpackServerStarter";
import {ArgsUtil} from "./ArgsUtil";

export const WebpackUtil = Object.freeze({
    Builder: WebpackBuilder,
    ServerStarter: rspackServerStarter,
    ...ArgsUtil,
});
