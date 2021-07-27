import React from "react";
import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import {ModalUtil} from "../../util/ModalUtil";
import {MediaUtil} from "../../util/MediaUtil";
import {i18n} from "../../internal/i18n/core";
import type {UploaderProps, UploadSuccessLogEntry} from "../../util/UploadUtil/type";
import {Uploader} from "../../core/Uploader";
import {Tooltip} from "../../core/Tooltip";
import "./index.less";

export interface Props<SuccessResponseType, ErrorResponseType> extends UploaderProps<SuccessResponseType, ErrorResponseType> {
    imageURL: string | null;
    onChange: (response: SuccessResponseType) => void;
    width: number; // At least 200px if onRemove supported, else at least 150px
    height: number;
    onRemove?: () => void;
    disabled?: boolean;
    fileSizeLimitMB?: number;
    className?: string;
    style?: React.CSSProperties;
}

export class ImageUploader<SuccessResponseType, ErrorResponseType> extends React.PureComponent<Props<SuccessResponseType, ErrorResponseType>> {
    static displayName = "ImageUploader";

    openPreviewModal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {imageURL} = this.props;
        if (imageURL) {
            await MediaUtil.openImage(imageURL);
        }
    };

    removeImage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {onRemove} = this.props;
        const t = i18n();
        if (await ModalUtil.confirm(t.confirmImageRemoval)) {
            onRemove?.();
        }
    };

    beforeUpload = (file: File): boolean => {
        const {fileSizeLimitMB} = this.props;
        if (fileSizeLimitMB && file.size > 1024 * 1024 * fileSizeLimitMB) {
            return false;
        }
        return true;
    };

    preventUploadBehavior = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            // Only trigger for clicking "Upload" icon
            e.stopPropagation();
        }
    };

    onUploadSuccess = (logEntry: UploadSuccessLogEntry, response: SuccessResponseType) => {
        const {onChange, onUploadSuccess} = this.props;
        onChange(response);
        onUploadSuccess?.(logEntry, response);
    };

    renderActionIcon = (name: string, icon: React.ReactElement) => {
        return (
            <Tooltip title={name}>
                <div className="action">{icon}</div>
            </Tooltip>
        );
    };

    render() {
        const {uploadURL, formField, className, style, imageURL, disabled, width, height, onRemove, onUploadFailure} = this.props;
        const t = i18n();
        return (
            <Uploader<SuccessResponseType, ErrorResponseType>
                accept="image/*"
                formField={formField}
                uploadURL={uploadURL}
                onUploadFailure={onUploadFailure}
                onUploadSuccess={this.onUploadSuccess}
                style={{...style, width, height}}
                className={`g-image-uploader ${className || ""}`}
                disabled={disabled}
                beforeUpload={this.beforeUpload}
            >
                {imageURL ? (
                    <div className="image-container" style={{backgroundImage: `url(${imageURL})`, height}}>
                        <div className="overlay" onClick={this.preventUploadBehavior}>
                            {this.renderActionIcon(t.preview, <EyeOutlined onClick={this.openPreviewModal} />)}
                            {!disabled && this.renderActionIcon(t.upload, <CloudUploadOutlined />)}
                            {!disabled && onRemove && this.renderActionIcon(t.delete, <DeleteOutlined onClick={this.removeImage} />)}
                        </div>
                    </div>
                ) : (
                    t.uploadHint
                )}
            </Uploader>
        );
    }
}
