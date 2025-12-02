import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

interface Props {
    html: string;
    className?: string;
}

export const HTMLContent = ReactUtil.memo("HTMLContent", ({html, className}: Props) => {
    return <div className={classNames("g-html-content", className)} dangerouslySetInnerHTML={{__html: html}} />;
});
