import React from "react";
import {ModalUtil} from "@pinnacle0/web-ui//util/ModalUtil";
import type {UploadFailureLogEntry, UploadSuccessLogEntry} from "@pinnacle0/web-ui/util/UploadUtil/type";

/**
 * This API is mocked by webpack-dev-server, to respond a fixed image, of typing TestImageUploadResponse.
 */
export const dummyUploadImageUploadURL = "/ajax/upload";
export const dummyUploadImageFormField = "image";

export const dummyUploadCallback = (logEntry: UploadFailureLogEntry | UploadSuccessLogEntry) => {
    ModalUtil.createSync({
        title: "Upload Callback",
        body: <pre>{JSON.stringify(logEntry, null, 2)}</pre>,
    });
};

export const dummyImportCallback = async (file: File) => {
    const content = await importTxt(file);
    ModalUtil.createSync({
        title: "Import Callback",
        body: content === null ? "<Fail to import>" : content,
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
