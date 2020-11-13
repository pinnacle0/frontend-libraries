import {Utility} from "@pinnacle0/devtool-util";
import path from "path";

Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", path.join(__dirname, "../src")]);
Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", path.join(__dirname, "../test")]);
