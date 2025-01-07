import path from "path";
import {WebpackUtil} from "@pinnacle0/webpack-util";
import type {TestImageUploadResponse, APIErrorResponse} from "../test/ui-test/src/type";

new WebpackUtil.ServerStarter({
    projectDirectory: path.join(import.meta.dirname, "../test/ui-test"),
    port: 4455,
    dynamicPathResolvers: [
        {
            prefix: "@pinnacle0/web-ui",
            resolver: path.join(import.meta.dirname, "../src"),
        },
    ],
    interceptExpressApp: app =>
        app.post("/ajax/upload", (_, response) => {
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
