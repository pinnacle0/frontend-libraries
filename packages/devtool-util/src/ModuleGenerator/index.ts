import {AppModuleGenerator} from "./AppModuleGenerator";
import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import {WebModuleGenerator} from "./WebModuleGenerator";

export class ModuleGenerator extends ModuleGeneratorBase {
    static App = AppModuleGenerator;
    static Web = WebModuleGenerator;
}
