import type {ImageProps} from "antd/lib/image";
import AntImage from "antd/lib/image";
import React from "react";
import "antd/lib/image/style";

export interface Props extends ImageProps {}

export class Image extends React.PureComponent<Props> {
    static displayName = "Image";

    render() {
        return <AntImage {...this.props} />;
    }
}
