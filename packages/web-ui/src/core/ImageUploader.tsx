import React from "react";
import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import {ModalUtil} from "../util/ModalUtil";
import {MediaUtil} from "../util/MediaUtil";
import {i18n} from "../internal/i18n/core";
import {Uploader} from "./Uploader";
import {ImageUploadResponse, UploadProps, UploadSuccessLogEntry, UploadUtil} from "../util/UploadUtil";

export interface Props extends UploadProps {
    imageURL: string | null;
    onChange: (value: ImageUploadResponse | null) => void;
    className?: string;
    style?: React.CSSProperties;
    removable?: boolean;
    disabled?: boolean;
    displayImageImageURL?: boolean;
}

export class ImageUploader extends React.PureComponent<Props> {
    static displayName = "ImageUploader";

    private readonly thumbStyle: React.CSSProperties = {width: 150, cursor: "pointer", marginLeft: 16};
    private readonly closeButtonStyle: React.CSSProperties = {marginRight: 10};

    openPreviewModal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {imageURL} = this.props;
        if (imageURL) {
            await MediaUtil.open(imageURL, "image");
        }
    };

    removeImage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {onChange} = this.props;
        const t = i18n();
        if (await ModalUtil.confirm(t.confirmImageRemoval)) {
            onChange(null);
        }
    };

    onUploadSuccess = (response: any, logEntry: UploadSuccessLogEntry) => {
        const {onChange, onUploadSuccess, onUploadFailure} = this.props;
        try {
            const imageResponse = UploadUtil.castImageUploadResponse(response);
            onChange(imageResponse);
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
        const {imageURL, uploadURL, onUploadFailure, className, style, removable, disabled} = this.props;
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
            >
                {imageURL ? (
                    <React.Fragment>
                        <img src={imageURL} style={this.thumbStyle} onClick={this.openPreviewModal} /> {removable && <CloseOutlined onClick={this.removeImage} style={this.closeButtonStyle} />}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <CloudUploadOutlined /> {t.select}
                    </React.Fragment>
                )}
            </Uploader>
        );
    }
}
