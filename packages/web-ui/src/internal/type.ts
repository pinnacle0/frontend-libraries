import React from "react";

export type SafeReactChild = React.ReactChild | boolean | null;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];

export type KeysOfType<T, ExpectedValueType> = {[P in keyof T]: T[P] extends ExpectedValueType ? P : never}[keyof T];
export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export interface ControlledFormValue<T> {
    value: T;
    onChange: (value: T) => void;
}

export interface ImageUploadResponse {
    imageURL: string;
    imageKey: string;
}

export interface UploadProps {
    /**
     * URL for uploading.
     * Method: POST
     * Request: Put image file into "image" field of FormData
     * Response: JSON format, ref UploadResponse
     */
    uploadURL: string;
    /**
     * A callback when upload finishes, can be used for logging, or alert to user.
     *
     * @param result: the final upload status
     * @param info: can be JSON.stringify, including file data and API response
     * @param duration: millisecond of the upload process
     * @param response: the API response
     */
    onUpload: (result: "success" | "failure", info: {[key: string]: string}, duration: number, response: any) => void;
}
