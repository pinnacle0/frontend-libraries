import React from "react";
import {classNames} from "../../../util/ClassNames";
import {Loader} from "../shared/Loader";
import type {Ref} from "react";
import "./index.less";
import {ReactUtil} from "../../../util/ReactUtil";

interface Props {
    refreshing: boolean;
    ref: Ref<HTMLDivElement | null>;
    message?: string;
}

export const Refresh = ReactUtil.memo("Refresh", ({message, refreshing, ref}: Props) => {
    return (
        <div ref={ref} className={classNames("g-flat-list-refresh", {refreshing})}>
            {refreshing ? <Loader /> : <span>{message ?? "release to refresh"}</span>}
        </div>
    );
});
