import React from "react";
import AntSkeleton, {SkeletonProps} from "antd/lib/skeleton";
import "antd/lib/skeleton/style";

export interface Props extends SkeletonProps {}

export class Skeleton extends React.PureComponent<Props> {
    static displayName = "Skeleton";

    render() {
        return <AntSkeleton {...this.props} />;
    }
}
