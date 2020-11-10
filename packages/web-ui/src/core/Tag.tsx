import React from "react";
import AntTag, {TagProps} from "antd/lib/tag";
import "antd/lib/tag/style";
import {PresetColorType, PresetStatusColorType} from "antd/lib/_util/colors";

export interface Props extends TagProps {}

export class Tag extends React.PureComponent<Props> {
    static displayName = "Tag";

    render() {
        return <AntTag {...this.props} />;
    }
}

export type TagColor = PresetColorType | PresetStatusColorType;
