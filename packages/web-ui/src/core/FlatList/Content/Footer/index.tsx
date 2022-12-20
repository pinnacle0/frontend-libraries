import React from "react";
import {Loader} from "../../Loader";
import "./index.less";

interface Props {
    hasNextPage: boolean;
    endOfListMessage?: string;
    hasNextPageMessage?: string;
    loading?: boolean;
}
export const Footer = ({loading, hasNextPage, hasNextPageMessage, endOfListMessage}: Props) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const end = endOfListMessage ?? "All data loaded";
    const next = hasNextPageMessage ?? "Pull up to load more";

    return (
        <div ref={ref} className="g-flat-list-footer">
            {loading ? <Loader /> : hasNextPage ? next : end}
        </div>
    );
};