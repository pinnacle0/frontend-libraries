export interface ImageUploadResponse {
    imageURL: string;
    imageKey: string;
}

/**
 * Use underscore naming, for sake of logging purpose.
 */
export interface UploadLogInfo {
    file_name: string;
    file_size: string;
    file_type: string;
    api_response: string;
}

export interface UploadSuccessLogEntry {
    info: UploadLogInfo;
    elapsedTime: number;
}

export interface UploadFailureLogEntry extends UploadSuccessLogEntry {
    errorCode: string;
    errorMessage: string;
}

export interface UploadProps {
    /**
     * URL for uploading
     *
     * Method: POST
     * Request: Put image file into "image" field of FormData
     * Response: For RichEditor/ImageUploader, use ImageUploadResponse (JSON)
     */
    uploadURL: string;
    /**
     * Callbacks when upload finishes, can be used for logging, or alert to user.
     *
     * @response is the parsed object from JSON.
     * For RichEditor/ImageUploader, it is ImageUploadResponse.
     *
     * @logEntry.errorMessage is for technical logging, not used for UI display.
     * Display a general error message (or from API response) when failure.
     */
    onUploadFailure: (response: any, logEntry: UploadFailureLogEntry) => void;
    onUploadSuccess: (response: any, logEntry: UploadSuccessLogEntry) => void;
}

function castImageUploadResponse(response: any): ImageUploadResponse {
    // responseObject must be checked as object already
    const checkResponseObjectPattern = (responseObject: any) => {
        if (typeof responseObject.imageURL !== "string" || typeof responseObject.imageKey !== "string") {
            throw new Error("Upload response is not of {imageURL, imageKey} pattern");
        }
    };

    if (!response) {
        throw new Error("Upload response is empty");
    } else {
        const responseType = typeof response;
        if (responseType === "string") {
            try {
                const parsed = JSON.parse(response);
                checkResponseObjectPattern(parsed);
                return parsed as ImageUploadResponse;
            } catch (e) {
                throw new Error("Upload response is not in valid JSON format");
            }
        } else if (responseType === "object") {
            checkResponseObjectPattern(response);
            return response as ImageUploadResponse;
        } else {
            throw new Error(`Upload response unknown format: ${responseType}`);
        }
    }
}

export const UploadUtil = Object.freeze({
    castImageUploadResponse,
});
