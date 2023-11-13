import {WebpackBuilder} from "./WebpackBuilder";
import {WebpackServerStarter} from "./WebpackServerStarter";
import {ArgsUtil} from "./ArgsUtil";

export const WebpackUtil = Object.freeze({
    Builder: WebpackBuilder,
    ServerStarter: WebpackServerStarter,
    ...ArgsUtil,
});
