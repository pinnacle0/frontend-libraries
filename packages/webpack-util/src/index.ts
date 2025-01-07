import {Builder} from "./Builder.js";
import {ServerStarter} from "./ServerStarter.js";
import {ArgsUtil} from "./ArgsUtil.js";

export const WebpackUtil = Object.freeze({
    Builder,
    ServerStarter,
    ...ArgsUtil,
});
