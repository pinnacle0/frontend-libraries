import React, {CSSProperties} from "react";
import {SafeReactChildren} from "../internal/type";
import AntUpload, {RcFile, UploadChangeParam} from "antd/lib/upload";
import {HttpRequestHeader, UploadFile} from "antd/lib/upload/interface";
import "antd/lib/upload/style";
import {Spin} from "./Spin";

export interface Props {
    children: SafeReactChildren;
    /**
     * Please follow W3C standard for HTML accept string.
     * Ref:
     * https://www.w3schools.com/tags/att_input_accept.asp
     */
    accept: string;
    name?: string;
    headers?: HttpRequestHeader;
    uploadURL?: string;
    beforeUpload?: (file: File) => void;
    onUpload?: (result: "success" | "failure", loggableInfo: {[key: string]: string}, duration: number, apiResponse: any, file: UploadFile) => void;
    className?: string;
    // only accept height with number
    style?: CSSProperties;
    disabled?: boolean;
}

interface State {
    uploading: boolean;
}

export class Uploader extends React.PureComponent<Props, State> {
    static displayName = "Uploader";

    private uploadStartTime: number | undefined;
    private defaultStyle: React.CSSProperties = {minWidth: 150};

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

    beforeUpload = (file: RcFile) => {
        const {beforeUpload, uploadURL} = this.props;
        beforeUpload?.(file);
        return uploadURL ? true : false;
    };

    onUpload = (info: UploadChangeParam) => {
        const file = info.file;
        const fileInfo: {[key: string]: string} = {
            fileName: file.fileName || file.name,
            fileSize: file.size.toString(),
            fileType: file.type,
        };
        if (file.status === "uploading") {
            this.setState({uploading: true});
            this.uploadStartTime = Date.now();
        } else if (file.status === "done" || file.status === "error") {
            const {onUpload} = this.props;
            const response = file.response;
            try {
                const info: {[key: string]: string} = {
                    ...fileInfo,
                    apiResponse: JSON.stringify(response),
                };
                if (file.error) {
                    info.fileError = JSON.stringify(file.error);
                }
                onUpload?.(file.status === "done" ? "success" : "failure", info, this.uploadStartTime ? Date.now() - this.uploadStartTime : 0, response, file);
            } finally {
                this.setState({uploading: false});
            }
        }
    };

    render() {
        const {children, accept, className, style, uploadURL, name, disabled, headers} = this.props;
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
                beforeUpload={this.beforeUpload}
                headers={headers}
            >
                <Spin spinning={this.state.uploading} size="small">
                    {children}
                </Spin>
            </AntUpload.Dragger>
        );
    }
}
