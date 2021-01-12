import React from "react";
import type {TagProps} from "antd/lib/tag";
import AntTag from "antd/lib/tag";
import "antd/lib/tag/style";
import type {PresetColorType, PresetStatusColorType} from "antd/lib/_util/colors";

export interface Props extends TagProps {}

export class Tag extends React.PureComponent<Props> {
    static displayName = "Tag";

    render() {
        return <AntTag {...this.props} />;
    }
}

export type TagColor = PresetColorType | PresetStatusColorType;
