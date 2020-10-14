import React from "react";
import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import {ModalUtil} from "../util/ModalUtil";
import {MediaUtil} from "../util/MediaUtil";
import {ControlledFormValue} from "../internal/type";
import {i18n} from "../internal/i18n/core";
import {Uploader} from "./Uploader";
import {ImageUploadResponse, UploadProps, UploadSuccessLogEntry, UploadUtil} from "../util/UploadUtil";

export interface Props extends ControlledFormValue<ImageUploadResponse | null>, UploadProps {
    className?: string;
    style?: React.CSSProperties;
}

export class ImageUploader extends React.PureComponent<Props> {
    static displayName = "ImageUploader";

    private readonly thumbStyle: React.CSSProperties = {width: 150, cursor: "pointer", marginLeft: 16};
    private readonly closeButtonStyle: React.CSSProperties = {marginRight: 10};

    openPreviewModal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const {value} = this.props;
        if (value) {
            await MediaUtil.open(value.imageURL, "image");
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
        const {value, uploadURL, onUploadFailure, className, style} = this.props;
        const t = i18n();
        // TODO/any: why disabled={!!value}
        return (
            <Uploader
                name="image"
                accept="image/*"
                uploadURL={uploadURL}
                onUploadFailure={onUploadFailure}
                onUploadSuccess={this.onUploadSuccess}
                style={style}
                className={className}
                disabled={!!value}
            >
                {value ? (
                    <React.Fragment>
                        <img src={value.imageURL} style={this.thumbStyle} onClick={this.openPreviewModal} /> <CloseOutlined onClick={this.removeImage} style={this.closeButtonStyle} />
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
