import React from "react";
import type {SkeletonProps} from "antd/es/skeleton";
import AntSkeleton from "antd/es/skeleton";
import {classNames} from "../../util/ClassNames";

export interface Props extends SkeletonProps {}

export class Skeleton extends React.PureComponent<Props> {
    static displayName = "Skeleton";

    render() {
        const {className, ...restProps} = this.props;
        return <AntSkeleton className={classNames("g-skeleton", className)} {...restProps} />;
    }
}
