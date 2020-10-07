import {pathMap} from "../config/path-map";
import * as commands from "./commands";

const {srcConfigDirectory, srcRuleDirectory, templateDirectory} = pathMap;

new commands.GenerateExportRulesFile({srcRuleDirectory, templateDirectory}).run();
new commands.GenerateConfigFile({srcConfigDirectory, srcRuleDirectory, templateDirectory}).run();
