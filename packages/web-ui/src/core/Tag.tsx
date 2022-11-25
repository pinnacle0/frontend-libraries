import React from "react";
import type {TagProps} from "antd/es/tag";
import AntTag from "antd/es/tag";
import "antd/es/tag/style";
import type {PresetColorType, PresetStatusColorType} from "antd/es/_util/colors";

export interface Props extends TagProps {}

export class Tag extends React.PureComponent<Props> {
    static displayName = "Tag";

    render() {
        return <AntTag {...this.props} />;
    }
}

export type TagColor = PresetColorType | PresetStatusColorType;
