import React from "react";
import {classNames} from "../../../../util/ClassNames";
import {Loader} from "../../shared/Loader";
import {ReactUtil} from "../../../../util/ReactUtil";
import "./index.less";

interface Props {
    hasNextPage: boolean;
    endOfListMessage?: string;
    hasNextPageMessage?: string;
    loading?: boolean;
}
export const Footer = ReactUtil.memo("Footer", ({loading, hasNextPage, hasNextPageMessage, endOfListMessage}: Props) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const end = endOfListMessage ?? "All data loaded";
    const next = hasNextPageMessage ?? "Pull up to load more";

    return (
        <div ref={ref} className={classNames("g-flat-list-footer", {loading})}>
            {loading ? <Loader /> : hasNextPage ? next : end}
        </div>
    );
});
