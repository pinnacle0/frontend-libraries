import {AppModuleGenerator} from "./AppModuleGenerator";
import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import {WebModuleGenerator} from "./WebModuleGenerator";

// TODO: Object.freeze usage
export class ModuleGenerator extends ModuleGeneratorBase {
    static App = AppModuleGenerator;
    static Web = WebModuleGenerator;
}
