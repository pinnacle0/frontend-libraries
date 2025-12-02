import React from "react";
import {classNames} from "../../../util/ClassNames";
import {Loader} from "../shared/Loader";
import {ReactUtil} from "../../../util/ReactUtil";
import "./index.less";

interface Props {
    show: boolean;
}

export const FloatingLoader = ReactUtil.memo("FloatingLoader", ({show}: Props) => {
    return (
        <div className={classNames("g-flat-list-floating-loader", {show})}>
            <Loader />
        </div>
    );
});
