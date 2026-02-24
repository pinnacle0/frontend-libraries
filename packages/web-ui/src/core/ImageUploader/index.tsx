import React from "react";
import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import {classNames} from "../../util/ClassNames";
import {ModalUtil} from "../../util/ModalUtil";
import {MediaUtil} from "../../util/MediaUtil";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import type {UploaderProps, UploadSuccessLogEntry} from "../../util/UploadUtil/type";
import {ReactUtil} from "../../util/ReactUtil";
import {Uploader} from "../Uploader";
import {Tooltip} from "../Tooltip";
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

export const ImageUploader = ReactUtil.memo("ImageUploader", <Res, Err>(props: Props<Res, Err>) => {
    const {uploadURL, formField, className, style, imageURL, disabled, width, height, onRemove, onUploadFailure, fileSizeLimitMB, onChange, onUploadSuccess} = props;
    const t = i18n();

    const openPreviewModal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (imageURL) await MediaUtil.openImage(imageURL);
    };

    const removeImage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (await ModalUtil.confirm(t.confirmImageRemoval)) {
            onRemove?.();
        }
    };

    const beforeUpload = (file: File): boolean => {
        if (fileSizeLimitMB && file.size > 1000 * 1000 * fileSizeLimitMB) {
            ModalUtil.createSync({body: TextUtil.interpolate(t.imageOversizeAlert, fileSizeLimitMB.toString())});
            return false;
        }
        return true;
    };

    const preventUploadBehavior = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            // Only trigger for clicking "Upload" icon
            e.stopPropagation();
        }
    };

    const onAntUploadSuccess = (logEntry: UploadSuccessLogEntry, response: Res) => {
        onChange(response);
        onUploadSuccess?.(logEntry, response);
    };

    const renderActionIcon = (name: string, icon: React.ReactElement) => {
        return (
            <Tooltip title={name} childContainerProps={{className: "action"}}>
                {icon}
            </Tooltip>
        );
    };

    return (
        <Uploader<Res, Err>
            accept="image/*"
            formField={formField}
            uploadURL={uploadURL}
            onUploadFailure={onUploadFailure}
            onUploadSuccess={onAntUploadSuccess}
            style={{...style, width, height}}
            className={classNames("g-image-uploader", className)}
            disabled={disabled}
            beforeUpload={beforeUpload}
        >
            {imageURL ? (
                <div className="image-container" style={{backgroundImage: `url(${imageURL})`, height}}>
                    <div className="overlay" onClick={preventUploadBehavior}>
                        {renderActionIcon(t.preview, <EyeOutlined onClick={openPreviewModal} />)}
                        {!disabled && renderActionIcon(t.upload, <CloudUploadOutlined />)}
                        {!disabled && onRemove && renderActionIcon(t.delete, <DeleteOutlined onClick={removeImage} />)}
                    </div>
                </div>
            ) : (
                t.uploadHint
            )}
        </Uploader>
    );
});
