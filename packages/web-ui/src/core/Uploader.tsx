import React from "react";
import type {SafeReactChildren} from "../internal/type";
import type {UploadChangeParam} from "antd/lib/upload";
import AntUpload from "antd/lib/upload";
import {Spin} from "./Spin";
import type {UploadLogInfo, UploadProps} from "../util/UploadUtil";
import "antd/lib/upload/style";

export interface Props extends Partial<UploadProps> {
    children: SafeReactChildren;
    /**
     * Please follow W3C standard for HTML accept string.
     * Ref:
     * https://www.w3schools.com/tags/att_input_accept.asp
     */
    accept: string;
    name: string;
    beforeUpload?: (file: File) => boolean | PromiseLike<void>;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

interface State {
    uploading: boolean;
}

export class Uploader extends React.PureComponent<Props, State> {
    static displayName = "Uploader";

    private uploadStartTime: number | undefined;
    private defaultStyle: React.CSSProperties = {minWidth: 250};

    constructor(props: Props) {
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

    onUpload = (info: UploadChangeParam) => {
        const file = info.file;
        if (file.status === "uploading") {
            this.setState({uploading: true});
            this.uploadStartTime = Date.now();
        } else if (file.status === "done" || file.status === "error") {
            const {onUploadSuccess, onUploadFailure} = this.props;
            const response = file.response;
            try {
                const info: UploadLogInfo = {
                    file_name: file.fileName || file.name,
                    file_size: file.size.toString(),
                    file_type: file.type,
                    api_response: JSON.stringify(response),
                };
                const elapsedTime = this.uploadStartTime ? Date.now() - this.uploadStartTime : 0;

                if (file.status === "error") {
                    onUploadFailure?.(response, {
                        info,
                        elapsedTime,
                        errorCode: "UPLOAD_FAILURE",
                        errorMessage: JSON.stringify(file.error) || "[No Message]",
                    });
                } else {
                    onUploadSuccess?.(response, {
                        info,
                        elapsedTime,
                    });
                }
            } finally {
                this.setState({uploading: false});
            }
        }
    };

    render() {
        const {children, accept, beforeUpload, className, style, uploadURL, name, disabled} = this.props;
        return (
            <AntUpload.Dragger
                name={name}
                showUploadList={false}
                multiple={false}
                accept={accept}
                className={className}
                style={{...this.defaultStyle, ...style}}
                action={uploadURL}
                onChange={this.onUpload}
                disabled={this.state.uploading || disabled}
                height={Number(style?.height)}
                beforeUpload={beforeUpload}
                headers={{Accept: "application/json"}}
            >
                <Spin spinning={this.state.uploading} size="small">
                    {children}
                </Spin>
            </AntUpload.Dragger>
        );
    }
}
