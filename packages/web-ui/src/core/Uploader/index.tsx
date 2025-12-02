import React from "react";
import type {UploadChangeParam} from "antd/es/upload";
import type {HttpRequestHeader} from "antd/es/upload/interface";
import AntUpload from "antd/es/upload";
import type {UploaderProps, UploadLogInfo} from "../../util/UploadUtil/type";
import {Spin} from "../Spin";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<SuccessResponseType, ErrorResponseType> extends UploaderProps<SuccessResponseType, ErrorResponseType> {
    children: React.ReactNode;
    /**
     * Please follow W3C standard for HTML accept string.
     * Ref:
     * https://www.w3schools.com/tags/att_input_accept.asp
     */
    accept: string;
    beforeUpload?: (file: File) => boolean | Promise<void | Blob | File>;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const defaultStyle: React.CSSProperties = {minWidth: 250};
const UPLOAD_HEADER: HttpRequestHeader = {Accept: "application/json"};

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

    const onUploadChange = ({file}: UploadChangeParam) => {
        if (file.status === "uploading") {
            setUploading(true);
            uploadStartTime.current = Date.now();
        } else if (file.status === "done" || file.status === "error") {
            try {
                const info: UploadLogInfo = {
                    file_name: file.fileName || file.name,
                    file_size: file.size?.toString() || "-",
                    file_type: file.type || "-",
                    api_response: JSON.stringify(file.response),
                };
                const elapsedTime = uploadStartTime.current ? Date.now() - uploadStartTime.current : 0;

                if (file.status === "error") {
                    onUploadFailure?.(
                        {
                            info,
                            elapsedTime,
                            errorCode: "UPLOADER_FAILURE",
                            errorMessage: file.error?.toString() || "[No Message]",
                            statusCode: Number(file.error?.status), // Un-official API, by trial
                        },
                        file.response
                    );
                } else {
                    onUploadSuccess?.(
                        {
                            info,
                            elapsedTime,
                        },
                        file.response
                    );
                }
            } finally {
                setUploading(false);
                uploadStartTime.current = null;
            }
        }
    };

    return (
        <AntUpload.Dragger
            name={formField}
            showUploadList={false}
            multiple={false}
            accept={accept}
            className={className}
            style={{...defaultStyle, ...style}}
            action={uploadURL}
            onChange={onUploadChange}
            disabled={uploading || disabled}
            beforeUpload={beforeUpload}
            headers={UPLOAD_HEADER}
        >
            <Spin spinning={uploading} size="small">
                {children}
            </Spin>
        </AntUpload.Dragger>
    );
});
