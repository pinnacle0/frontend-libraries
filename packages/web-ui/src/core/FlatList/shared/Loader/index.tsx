import React from "react";
import {ReactUtil} from "../../../../util/ReactUtil";
import "./index.less";

export const Loader = ReactUtil.memo("Loader", () => {
    return (
        <div className="g-flat-list-loader">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
        </div>
    );
});
