import {AppModuleGenerator} from "./AppModuleGenerator";
import {WebModuleGenerator} from "./WebModuleGenerator";

export const ModuleGenerator = Object.freeze({
    App: AppModuleGenerator,
    Web: WebModuleGenerator,
});
