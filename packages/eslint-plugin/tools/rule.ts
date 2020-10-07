import yargs from "yargs";
import {pathMap} from "../config/path-map";
import * as commands from "./commands";

const {srcConfigDirectory, srcRuleDirectory, testRuleDirectory, templateDirectory} = pathMap;

const newRuleName = yargs.argv._[0];

new commands.GenerateNewRule({srcRuleDirectory, templateDirectory, newRuleName}).run();

new commands.GenerateNewTest({testRuleDirectory, templateDirectory, newRuleTestName: newRuleName}).run();

new commands.GenerateExportRulesFile({srcRuleDirectory, templateDirectory}).run();
new commands.GenerateConfigFile({srcConfigDirectory, srcRuleDirectory, templateDirectory});

// Should not need to run formatter
// new commands.RunFormatter(srcRuleDirectory, testRuleDirectory).run();
