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
    statusCode?: number; // Only exist for HTTP response non-200 case
}

export type UploadSuccessCallback<ResponseType = any> = (logEntry: UploadSuccessLogEntry, response: ResponseType) => void;
export type UploadFailureCallback<ResponseType = any> = (logEntry: UploadFailureLogEntry, response?: ResponseType) => void;

export interface UploaderProps<SuccessResponseType = any, ErrorResponseType = any> {
    /**
     * POST form field for image content.
     */
    formField: string;
    /**
     * URL for uploading (method POST).
     */
    uploadURL: string;
    onUploadSuccess?: UploadSuccessCallback<SuccessResponseType>;
    onUploadFailure?: UploadFailureCallback<ErrorResponseType>;
}

export interface CreateUploadRequestOptions {
    uploadURL: string;
    file: File;
    formField: string;
    onSuccess: UploadSuccessCallback;
    onError?: UploadFailureCallback;
    onProgress?: (percentage: number) => void;
}
