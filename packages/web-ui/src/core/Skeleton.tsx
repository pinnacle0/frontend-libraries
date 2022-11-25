import React from "react";
import type {SkeletonProps} from "antd/es/skeleton";
import AntSkeleton from "antd/es/skeleton";
import "antd/es/skeleton/style";

export interface Props extends SkeletonProps {}

export class Skeleton extends React.PureComponent<Props> {
    static displayName = "Skeleton";

    render() {
        return <AntSkeleton {...this.props} />;
    }
}
