import React from "react";
import AntUpload from "antd/es/upload";
import {i18n} from "../internal/i18n/core";
import {TextUtil} from "../internal/TextUtil";
import {Spin} from "./Spin";

export interface Props {
    type: "txt" | "csv";
    onImport: (file: File) => Promise<void> | void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

interface State {
    importing: boolean;
}

export class LocalImporter extends React.PureComponent<Props, State> {
    static displayName = "LocalImporter";

    constructor(props: Props) {
        super(props);
        this.state = {importing: false};
    }

    beforeUpload = async (file: File): Promise<false> => {
        try {
            this.setState({importing: true});
            await this.props.onImport(file);
        } finally {
            this.setState({importing: false});
        }

        return false;
    };

    render() {
        const {type, children, className, disabled, style} = this.props;
        const {importing} = this.state;
        const t = i18n();
        return (
            <AntUpload.Dragger
                showUploadList={false}
                multiple={false}
                accept={type === "txt" ? ".txt" : ".csv"}
                className={className}
                disabled={disabled}
                style={style}
                height={Number(style?.height)}
                beforeUpload={this.beforeUpload}
            >
                <Spin spinning={importing} size="small">
                    {children || TextUtil.interpolate(t.localImporterHint, type)}
                </Spin>
            </AntUpload.Dragger>
        );
    }
}
