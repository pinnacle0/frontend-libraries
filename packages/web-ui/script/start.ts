import path from "path";
// @ts-ignore
import {WebpackUtil} from "../../webpack-util/src";
// @ts-ignore
import type {TestImageUploadResponse, APIErrorResponse} from "../test/ui-test/src/type";

new WebpackUtil.ServerStarter({
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
            if (Math.random() > 0.5) {
                const uploadResponse: TestImageUploadResponse = {
                    imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/11/Test-Logo.svg",
                    imageKey: "test",
                };
                response.json(uploadResponse);
            } else {
                const errorCode = Math.random() > 0.5 ? 500 : 400;
                const uploadResponse: APIErrorResponse = {
                    message: "Server Error, Please Retry",
                };
                response.status(errorCode).json(uploadResponse);
            }
        }),
}).run();
