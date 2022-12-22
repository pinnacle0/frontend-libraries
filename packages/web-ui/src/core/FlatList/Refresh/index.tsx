import React from "react";
import {classNames} from "../../../util/ClassNames";
import {Loader} from "../shared/Loader";
import "./index.less";

interface Props {
    refreshing: boolean;
    message?: string;
}

export const Refresh = React.forwardRef<HTMLDivElement, Props>(({message, refreshing}, ref) => {
    return (
        <div ref={ref} className={classNames("g-flat-list-refresh", {refreshing})}>
            {refreshing ? <Loader /> : <span>{message ?? "release to refresh"}</span>}
        </div>
    );
});
