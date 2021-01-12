import React from "react";
import {ModalUtil} from "@pinnacle0/web-ui/util/ModalUtil";
import type {UploadFailureLogEntry, UploadProps, UploadSuccessLogEntry} from "@pinnacle0/web-ui/util/UploadUtil";

/**
 * This API is mocked by webpack-dev-server, to respond a random image.
 */
export const dummyUploadURL = "/ajax/upload";

export const dummyUploadCallback: UploadProps["onUploadFailure"] & UploadProps["onUploadSuccess"] = (response: any, logEntry: UploadFailureLogEntry | UploadSuccessLogEntry) => {
    ModalUtil.createSync({
        title: "Upload Callback",
        body: <pre>{JSON.stringify(logEntry, null, 2)}</pre>,
    });
    console.info("Dummy upload callback:");
    console.info("[Response]", response);
    console.info("[LogEntry]", logEntry);
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
