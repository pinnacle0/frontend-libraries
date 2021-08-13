import {WebpackBuilder} from "./WebpackBuilder";
import {WebpackServerStarter} from "./WebpackServerStarter";
import {CoreUtil} from "./CoreUtil";

export const WebpackUtil = Object.freeze({
    Builder: WebpackBuilder,
    ServerStarter: WebpackServerStarter,
    ...CoreUtil,
});
