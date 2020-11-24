import React from "react";
import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import {ModalUtil} from "../util/ModalUtil";
import {MediaUtil} from "../util/MediaUtil";
import {i18n} from "../internal/i18n/core";
import {Uploader} from "./Uploader";
import {ImageUploadResponse, UploadProps, UploadSuccessLogEntry, UploadUtil} from "../util/UploadUtil";

export interface Props<Removable extends boolean> extends UploadProps {
    imageURL: Removable extends true ? string | null : string;
    onChange: (value: Removable extends true ? ImageUploadResponse | null : ImageUploadResponse) => void;
    removable: Removable;
    fileSizeLimitMB?: number;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    thumbStyle?: React.CSSProperties;
}

export class ImageUploader<Removable extends boolean> extends React.PureComponent<Props<Removable>> {
    static displayName = "ImageUploader";

    private readonly defaultThumbStyle: React.CSSProperties = {width: 150, cursor: "pointer", marginLeft: 16};
    private readonly flexContainerStyle: React.CSSProperties = {display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10};
    private readonly buttonStyle: React.CSSProperties = {margin: 10, fontSize: 15};

    openPreviewModal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {imageURL} = this.props;
        if (imageURL) {
            await MediaUtil.open(imageURL as string, "image");
        }
    };

    removeImage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {onChange} = this.props;
        const t = i18n();
        if (await ModalUtil.confirm(t.confirmImageRemoval)) {
            onChange(null as any);
        }
    };

    beforeUpload = (file: File): boolean => {
        const {fileSizeLimitMB} = this.props;
        if (fileSizeLimitMB && file.size > 1024 * 1024 * fileSizeLimitMB) {
            return false;
        }
        return true;
    };

    onUploadSuccess = (response: any, logEntry: UploadSuccessLogEntry) => {
        const {onChange, onUploadSuccess, onUploadFailure} = this.props;
        try {
            const imageResponse = UploadUtil.castImageUploadResponse(response);
            onChange(imageResponse as any);
            onUploadSuccess(imageResponse, logEntry);
        } catch (e) {
            onUploadFailure(response, {
                ...logEntry,
                errorCode: "INVALID_UPLOAD_RESPONSE",
                errorMessage: e?.message || "[Unknown]",
            });
        }
    };

    render() {
        const {imageURL, uploadURL, onUploadFailure, className, style, removable, disabled, thumbStyle} = this.props;
        const t = i18n();
        return (
            <Uploader
                name="image"
                accept="image/*"
                uploadURL={uploadURL}
                onUploadFailure={onUploadFailure}
                onUploadSuccess={this.onUploadSuccess}
                style={style}
                className={className}
                disabled={disabled}
                beforeUpload={this.beforeUpload}
            >
                <div style={this.flexContainerStyle}>
                    {imageURL && <img src={imageURL as string} style={{...this.defaultThumbStyle, ...thumbStyle}} onClick={this.openPreviewModal} />}
                    {imageURL && <EyeOutlined onClick={this.openPreviewModal} style={this.buttonStyle} />}
                    <CloudUploadOutlined />
                    {imageURL && removable && <CloseOutlined onClick={this.removeImage} style={this.buttonStyle} />}
                </div>
                {imageURL ? t.reUpload : t.upload}
            </Uploader>
        );
    }
}
