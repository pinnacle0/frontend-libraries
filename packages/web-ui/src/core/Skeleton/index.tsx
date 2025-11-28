import React from "react";
import type {SkeletonProps} from "antd/es/skeleton";
import AntSkeleton from "antd/es/skeleton";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends SkeletonProps {}

export const Skeleton = ReactUtil.memo("Skeleton", ({className, ...restProps}: Props) => {
    return <AntSkeleton className={classNames("g-skeleton", className)} {...restProps} />;
});
