import React from "react";
import {UploadProps} from "@pinnacle0/web-ui/internal/type";
import {ModalUtil} from "@pinnacle0/web-ui/util/ModalUtil";

/**
 * This API is mocked by webpack-dev-server, to respond a random image.
 */
export const dummyUploadURL = "/ajax/upload";

export const dummyUploadCallback: UploadProps["onUpload"] = (result, info, duration) => {
    ModalUtil.createSync({
        title: "Upload Callback",
        body: [
            <div>
                Upload Result: <em>{result}</em>
            </div>,
            <div>
                Info: <pre>{JSON.stringify(info, null, 2)}</pre>
            </div>,
            `Duration: ${duration} ms`,
        ],
    });
};

export const dummyImportCallback = async (file: File) => {
    const content = await importTxt(file);
    ModalUtil.createSync({
        title: "Import Callback",
        body: content,
    });
};

async function importTxt(file: File): Promise<string | null> {
    if (file.type.match(/text.*/)) {
        return new Promise<string | null>(resolve => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const rawContent = fileReader.result?.toString();
                if (rawContent) {
                    resolve(rawContent);
                } else {
                    resolve(null);
                }
            };
            fileReader.onerror = () => resolve(null);
            fileReader.readAsText(file);
        });
    }
    return null;
}
