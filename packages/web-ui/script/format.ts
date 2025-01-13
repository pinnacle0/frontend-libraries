import {BiomeUtil} from "@pinnacle0/devtool-util/BiomeUtil";
import path from "path";

BiomeUtil.format(path.join(import.meta.dirname, "../config"));
BiomeUtil.format(path.join(import.meta.dirname, "../script"));
BiomeUtil.format(path.join(import.meta.dirname, "../src"));
BiomeUtil.format(path.join(import.meta.dirname, "../test"));
