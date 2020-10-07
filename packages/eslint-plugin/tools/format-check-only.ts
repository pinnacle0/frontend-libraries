import {pathMap} from "../config/path-map";
import * as commands from "./commands";

const {configDirectory, srcDirectory, testDirectory, toolDirectory} = pathMap;

new commands.RunFormatterCheckOnly(configDirectory, srcDirectory, testDirectory, toolDirectory).run();
