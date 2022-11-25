import type {ImageProps} from "antd/es/image";
import AntImage from "antd/es/image";
import React from "react";
import "antd/es/image/style";

export interface Props extends ImageProps {}

export class Image extends React.PureComponent<Props> {
    static displayName = "Image";

    render() {
        return <AntImage {...this.props} />;
    }
}
