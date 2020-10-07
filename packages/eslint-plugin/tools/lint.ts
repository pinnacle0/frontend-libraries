import {pathMap} from "../config/path-map";
import * as commands from "./commands";

const {srcDirectory, testDirectory, toolDirectory} = pathMap;

new commands.RunLinter(srcDirectory, testDirectory, toolDirectory).run();
