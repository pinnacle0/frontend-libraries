import {AppModuleGenerator} from "./AppModuleGenerator.js";
import {WebModuleGenerator} from "./WebModuleGenerator.js";

export const ModuleGenerator = Object.freeze({
    App: AppModuleGenerator,
    Web: WebModuleGenerator,
});
