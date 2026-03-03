import React from "react";
import RcUpload from "@rc-component/upload";
import type {UploaderProps, UploadLogInfo} from "../../util/UploadUtil/type";
import {Spin} from "../Spin";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<SuccessResponseType, ErrorResponseType> extends UploaderProps<SuccessResponseType, ErrorResponseType> {
    children: React.ReactNode;
    accept: string;
    beforeUpload?: (file: File) => boolean | Promise<void | Blob | File>;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const defaultStyle: React.CSSProperties = {minWidth: 250};

export const Uploader = ReactUtil.memo("Uploader", <SuccessResponseType, ErrorResponseType>(props: Props<SuccessResponseType, ErrorResponseType>) => {
    const {children, accept, beforeUpload, className, style, uploadURL, formField, disabled, onUploadSuccess, onUploadFailure} = props;
    const [uploading, setUploading] = React.useState(false);
    const uploadStartTime = React.useRef<number | null>(null);

    const preventDefaultDragDrop = (e: DragEvent) => e.preventDefault();

    React.useEffect(() => {
        document.addEventListener("dragover", preventDefaultDragDrop);
        document.addEventListener("drop", preventDefaultDragDrop);
        return () => {
            document.removeEventListener("dragover", preventDefaultDragDrop);
            document.removeEventListener("drop", preventDefaultDragDrop);
        };
    }, []);

    const customRequest = async ({file, onSuccess, onError}: any) => {
        setUploading(true);
        uploadStartTime.current = Date.now();

        try {
            const formData = new FormData();
            formData.append(formField, file);

            const response = await fetch(uploadURL, {
                method: "POST",
                body: formData,
                headers: {Accept: "application/json"},
            });

            const responseData = await response.json();
            const elapsedTime = uploadStartTime.current ? Date.now() - uploadStartTime.current : 0;
            const info: UploadLogInfo = {
                file_name: file.name,
                file_size: file.size?.toString() || "-",
                file_type: file.type || "-",
                api_response: JSON.stringify(responseData),
            };

            if (!response.ok) {
                onUploadFailure?.(
                    {
                        info,
                        elapsedTime,
                        errorCode: "UPLOADER_FAILURE",
                        errorMessage: response.statusText || "[No Message]",
                        statusCode: response.status,
                    },
                    responseData
                );
            } else {
                onUploadSuccess?.({info, elapsedTime}, responseData);
            }
            onSuccess?.(responseData);
        } catch (error: any) {
            const elapsedTime = uploadStartTime.current ? Date.now() - uploadStartTime.current : 0;
            const info: UploadLogInfo = {
                file_name: file.name,
                file_size: file.size?.toString() || "-",
                file_type: file.type || "-",
                api_response: error?.toString() || "",
            };
            onUploadFailure?.(
                {
                    info,
                    elapsedTime,
                    errorCode: "UPLOADER_FAILURE",
                    errorMessage: error?.toString() || "[No Message]",
                    statusCode: 0,
                },
                undefined as any
            );
            onError?.(error);
        } finally {
            setUploading(false);
            uploadStartTime.current = null;
        }
    };

    return (
        <RcUpload
            name={formField}
            multiple={false}
            accept={accept}
            className={className}
            style={{...defaultStyle, ...style}}
            customRequest={customRequest as any}
            disabled={uploading || disabled}
            beforeUpload={beforeUpload as any}
        >
            <Spin spinning={uploading} size="small">
                {children}
            </Spin>
        </RcUpload>
    );
});
