import React from "react";
import AntUpload from "antd/es/upload";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import {Spin} from "../Spin";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    type: "txt" | "csv";
    onImport: (file: File) => Promise<void> | void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const LocalImporter = ReactUtil.memo("LocalImporter", ({type, children, className, disabled, style, onImport}: Props) => {
    const [importing, setImporting] = React.useState(false);
    const t = i18n();

    const beforeUpload = async (file: File): Promise<false> => {
        try {
            setImporting(true);
            await onImport(file);
        } finally {
            setImporting(false);
        }

        return false;
    };

    return (
        <AntUpload.Dragger
            showUploadList={false}
            multiple={false}
            accept={type === "txt" ? ".txt" : ".csv"}
            className={className}
            disabled={disabled}
            style={style}
            height={Number(style?.height)}
            beforeUpload={beforeUpload}
        >
            <Spin spinning={importing} size="small">
                {children || TextUtil.interpolate(t.localImporterHint, type)}
            </Spin>
        </AntUpload.Dragger>
    );
});
