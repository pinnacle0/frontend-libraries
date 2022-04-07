import React from "react";
import {Spin} from "../Spin";
import type {FooterData, Measure} from "./type";

interface Props extends FooterData {
    style: React.CSSProperties;
    measure: Measure;
}

export const Footer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {loading, ended, loadingMessage, endMessage, style, measure} = props;
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    React.useEffect(() => {
        measureRef.current();
    }, [loading, loadingMessage, endMessage, ended]);

    return (
        <div style={{...style}} ref={ref} className="g-flat-list-footer">
            {loading && (
                <div>
                    <Spin spinning size="small" />
                    <div>{loadingMessage ?? "loading..."}</div>
                </div>
            )}
            {ended && !loading && (endMessage ?? "All data loaded")}
        </div>
    );
});
