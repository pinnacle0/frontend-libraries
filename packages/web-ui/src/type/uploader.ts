/**
 * - Use snake_case, for logging purpose.
 * - Reason of using `type` instead of `interface`: https://github.com/microsoft/TypeScript/issues/15300
 */
export type UploadLogInfo = {
    file_name: string;
    file_size: string;
    file_type: string;
    api_response: string;
};

export interface UploadSuccessLogEntry {
    info: UploadLogInfo;
    elapsedTime: number;
}

export interface UploadFailureLogEntry extends UploadSuccessLogEntry {
    errorCode: string;
    errorMessage: string;
}

export interface UploaderProps<Response> {
    /**
     * POST form field for image content.
     */
    formField: string;
    /**
     * URL for uploading (method POST).
     */
    uploadURL: string;
    /**
     * Callbacks when upload finishes, can be used for logging or alerting.
     * @logEntry.errorMessage is for technical logging, not good for UI display.
     * Display a general error message when failure.
     */
    onUploadSuccess?: (logEntry: UploadSuccessLogEntry, response: Response) => void;
    onUploadFailure?: (logEntry: UploadFailureLogEntry) => void;
}
