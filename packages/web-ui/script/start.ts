import path from "path";
// @ts-ignore
import {WebpackServerStarter} from "../../webpack-util/src";
// @ts-ignore
import type {TestImageUploadResponse} from "../test/ui-test/src/type";

new WebpackServerStarter({
    projectDirectory: path.join(__dirname, "../test/ui-test"),
    port: 4455,
    dynamicPathResolvers: [
        {
            prefix: "@pinnacle0/web-ui",
            resolver: path.join(__dirname, "../src"),
        },
    ],
    interceptExpressApp: app =>
        app.post("/ajax/upload", (request, response) => {
            const uploadResponse: TestImageUploadResponse = {
                imageURL: "https://homepages.cae.wisc.edu/~ece533/images/pool.png",
                imageKey: "test",
            };
            response.json(uploadResponse);
        }),
}).run();
