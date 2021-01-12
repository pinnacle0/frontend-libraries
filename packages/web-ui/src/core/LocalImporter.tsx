import React from "react";
import type {SafeReactChildren} from "../internal/type";
import {Uploader} from "./Uploader";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import {i18n} from "../internal/i18n/core";
import {StringUtil} from "../internal/StringUtil";

export interface Props {
    type: "txt" | "csv";
    onImport: (file: File) => void;
    /**
     * If not specified, default children will display an icon and some text.
     */
    children?: SafeReactChildren;
    className?: string;
    disabled?: boolean;
    // height will be ignored by antd
    style?: React.CSSProperties;
    // antd <Upload> accepts only separated height prop with number
    height?: number;
}

export class LocalImporter extends React.PureComponent<Props> {
    static displayName = "LocalImporter";

    beforeUpload = (file: File) => {
        this.props.onImport(file);
        return false;
    };

    render() {
        const {type, children, onImport, ...rest} = this.props;
        const t = i18n();
        return (
            <Uploader name={LocalImporter.displayName} accept={type === "txt" ? ".txt" : ".csv"} beforeUpload={this.beforeUpload}>
                {children || (
                    <React.Fragment>
                        <UploadOutlined /> {StringUtil.interpolate(t.localImporterText, type)}
                    </React.Fragment>
                )}
            </Uploader>
        );
    }
}
