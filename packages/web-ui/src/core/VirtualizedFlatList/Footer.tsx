import React from "react";
import {Spin} from "../Spin";
import type {FooterData, Measure} from "./type";

export interface Props extends FooterData {
    measure: Measure;
}

export const Footer = (props: Props) => {
    const {loading, ended, loadingMessage, endMessage, measure} = props;
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    return (
        <div ref={measure} className="g-flat-list-footer">
            {loading && (
                <div>
                    <Spin spinning size="small" />
                    <div>{loadingMessage ?? "loading..."}</div>
                </div>
            )}
            {ended && !loading && (endMessage ?? "All data loaded")}
        </div>
    );
};
