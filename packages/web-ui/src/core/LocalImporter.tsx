import React, {CSSProperties} from "react";
import {SafeReactChildren} from "../internal/type";
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
    style?: CSSProperties;
    // antd <Upload> accepts only separated height prop with number
    height?: number;
}

export class LocalImporter extends React.PureComponent<Props> {
    static displayName = "LocalImporter";

    render() {
        const {type, children, onImport, ...rest} = this.props;
        const t = i18n();
        return (
            <Uploader accept={type === "txt" ? ".txt" : ".csv"} beforeUpload={onImport} {...rest}>
                {children || (
                    <React.Fragment>
                        <UploadOutlined /> {StringUtil.interpolate(t.localImporterText, type)}
                    </React.Fragment>
                )}
            </Uploader>
        );
    }
}
