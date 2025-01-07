import path from "path";
import {WebpackUtil} from "@pinnacle0/webpack-util";

new WebpackUtil.ServerStarter({
    projectDirectory: path.resolve(import.meta.dirname, "../test/mobile-ui-test"),
    port: 4456,
    dynamicPathResolvers: [
        {
            prefix: "@pinnacle0/web-ui",
            resolver: path.join(import.meta.dirname, "../src"),
        },
    ],
}).run();
