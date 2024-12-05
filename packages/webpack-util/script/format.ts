import {PrettierUtil} from "@pinnacle0/devtool-util/lib/PrettierUtil";
import path from "path";

PrettierUtil.format(path.join(import.meta.dirname, "../config"));
PrettierUtil.format(path.join(import.meta.dirname, "../script"));
PrettierUtil.format(path.join(import.meta.dirname, "../src"));
PrettierUtil.format(path.join(import.meta.dirname, "../test"));
