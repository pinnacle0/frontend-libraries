import React from "react";
import type {UploadChangeParam} from "antd/es/upload";
import type {HttpRequestHeader} from "antd/es/upload/interface";
import AntUpload from "antd/es/upload";
import type {UploaderProps, UploadLogInfo} from "../../util/UploadUtil/type";
import {Spin} from "../Spin";

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

interface State {
    uploading: boolean;
}

export class Uploader<SuccessResponseType, ErrorResponseType> extends React.PureComponent<Props<SuccessResponseType, ErrorResponseType>, State> {
    static displayName = "Uploader";

    private readonly defaultStyle: React.CSSProperties = {minWidth: 250};
    private readonly uploadHeader: HttpRequestHeader = {Accept: "application/json"};
    private uploadStartTime: number | undefined;

    constructor(props: Props<SuccessResponseType, ErrorResponseType>) {
        super(props);
        this.state = {uploading: false};
    }

    componentDidMount() {
        document.addEventListener("dragover", this.preventDefaultDragDrop);
        document.addEventListener("drop", this.preventDefaultDragDrop);
    }

    componentWillUnmount() {
        document.removeEventListener("dragover", this.preventDefaultDragDrop);
        document.removeEventListener("drop", this.preventDefaultDragDrop);
    }

    preventDefaultDragDrop = (e: DragEvent) => e.preventDefault();

    onUpload = ({file}: UploadChangeParam) => {
        if (file.status === "uploading") {
            this.setState({uploading: true});
            this.uploadStartTime = Date.now();
        } else if (file.status === "done" || file.status === "error") {
            const {onUploadSuccess, onUploadFailure} = this.props;

            try {
                const info: UploadLogInfo = {
                    file_name: file.fileName || file.name,
                    file_size: file.size?.toString() || "-",
                    file_type: file.type || "-",
                    api_response: JSON.stringify(file.response),
                };
                const elapsedTime = this.uploadStartTime ? Date.now() - this.uploadStartTime : 0;

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
                this.setState({uploading: false});
            }
        }
    };

    render() {
        const {children, accept, beforeUpload, className, style, uploadURL, formField, disabled} = this.props;
        const {uploading} = this.state;
        return (
            <AntUpload.Dragger
                name={formField}
                showUploadList={false}
                multiple={false}
                accept={accept}
                className={className}
                style={{...this.defaultStyle, ...style}}
                action={uploadURL}
                onChange={this.onUpload}
                disabled={this.state.uploading || disabled}
                beforeUpload={beforeUpload}
                headers={this.uploadHeader}
            >
                <Spin spinning={uploading} size="small">
                    {children}
                </Spin>
            </AntUpload.Dragger>
        );
    }
}
