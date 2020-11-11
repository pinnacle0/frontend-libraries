import {PrettierUtil} from "@pinnacle0/devtool-util";
import path from "path";

PrettierUtil.format(path.join(__dirname, "../src"));
PrettierUtil.format(path.join(__dirname, "../tools"));
