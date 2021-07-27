import type {CreateUploadRequestOptions, UploadLogInfo} from "./type";

function createRequest({uploadURL, file, formField, onSuccess, onError, onProgress}: CreateUploadRequestOptions) {
    const httpRequest = new XMLHttpRequest();
    const startTime = Date.now();
    const formData = new FormData();
    formData.append(formField, file);

    const handleNetworkError = (reason: string) => {
        const info: UploadLogInfo = {
            file_name: file.name,
            file_size: file.size.toString(),
            file_type: file.type,
            api_response: "-",
        };
        const elapsedTime = Date.now() - startTime;

        onError?.({
            info,
            elapsedTime,
            errorCode: "UPLOAD_NETWORK_ERROR",
            errorMessage: reason,
        });
    };

    httpRequest.addEventListener(
        "load",
        () => {
            let response: any;
            try {
                response = JSON.parse(httpRequest.response);
            } catch (e) {
                // Leave response as undefined
            }

            const info: UploadLogInfo = {
                file_name: file.name,
                file_size: file.size.toString(),
                file_type: file.type,
                api_response: httpRequest.responseText,
            };
            const elapsedTime = Date.now() - startTime;
            const statusCode = httpRequest.status;

            if (statusCode !== 200) {
                onError?.(
                    {
                        info,
                        elapsedTime,
                        errorCode: `UPLOAD_API_ERROR_${statusCode}`,
                        errorMessage: `HTTP response: ${httpRequest.responseText}`,
                        statusCode,
                    },
                    httpRequest.status
                );
            } else {
                onSuccess({info, elapsedTime}, response);
            }
        },
        false
    );
    httpRequest.addEventListener("error", () => handleNetworkError("HTTP request network error"), false);
    httpRequest.addEventListener("abort", () => handleNetworkError("HTTP request aborted"), false);
    httpRequest.addEventListener("timeout", () => handleNetworkError("HTTP request timeout"), false);
    httpRequest.upload.addEventListener("progress", event => onProgress?.((event.loaded / event.total) * 100), false);

    httpRequest.open("POST", uploadURL, true);
    httpRequest.send(formData);
}

export const UploadUtil = Object.freeze({
    createRequest,
});
