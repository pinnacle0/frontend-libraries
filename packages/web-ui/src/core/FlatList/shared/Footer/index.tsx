import React from "react";
import type {Measure} from "../../VirtualFlatList/type";
import type {FooterData} from "../../type";
import {Spinner} from "../Spinner";
import "./index.less";

export interface Props extends Omit<FooterData, "__markedAsFooterData"> {
    measure?: Measure;
}

export const Footer = (props: Props) => {
    const {loading, ended, loadMoreMessage, loadingMessage, endMessage, measure} = props;
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    return (
        <div className="g-flat-list-footer" ref={measure}>
            {loading && (typeof loadingMessage !== "object" ? <Spinner loading message={loadingMessage ?? "loading..."} /> : loadingMessage)}
            {ended && !loading && (endMessage ?? "All data loaded")}
            {!ended && !loading && (loadMoreMessage ?? "Pull up to loading more")}
        </div>
    );
};
