import path from "path";
import {WebpackUtil} from "@pinnacle0/webpack-util/src";

new WebpackUtil.ServerStarter({
    projectDirectory: path.resolve(__dirname, "../test/mobile-ui-test"),
    port: 4456,
    dynamicPathResolvers: [
        {
            prefix: "@pinnacle0/web-ui",
            resolver: path.join(__dirname, "../src"),
        },
    ],
}).run();
