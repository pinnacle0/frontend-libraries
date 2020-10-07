import CloudUploadOutlined from "@ant-design/icons/CloudUploadOutlined";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import React, {CSSProperties} from "react";
import {ModalUtil} from "../util/ModalUtil";
import {MediaUtil} from "../util/MediaUtil";
import {ControlledFormValue, UploadProps, ImageUploadResponse} from "../internal/type";
import {i18n} from "../internal/i18n/core";
import {Uploader} from "./Uploader";

export interface Props extends ControlledFormValue<ImageUploadResponse | null>, UploadProps {
    uploadURL: string;
    style?: CSSProperties;
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

    render() {
        const {value, onChange, uploadURL, onUpload, style} = this.props;
        const t = i18n();
        return (
            <Uploader name="image" accept="image/*" uploadURL={uploadURL} onUpload={onUpload} style={style} disabled={!!value}>
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
