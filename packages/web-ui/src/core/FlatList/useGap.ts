import type React from "react";
import type {Gap} from "./type";

export function useGap(gap?: Gap): React.CSSProperties {
    if (!gap) return {};
    if (Array.isArray(gap)) {
        return {marginTop: gap[0], marginBottom: gap[0], marginLeft: gap[1], marginRight: gap[1]};
    } else if (typeof gap === "number") {
        return {marginTop: gap, marginBottom: gap, marginLeft: gap, marginRight: gap};
    } else {
        const {top, bottom, left, right} = gap;
        return {marginTop: top, marginBottom: bottom, marginLeft: left, marginRight: right};
    }
}

export function usePaddingGap(gap?: Gap): React.CSSProperties {
    if (!gap) return {};
    if (Array.isArray(gap)) {
        return {paddingTop: gap[0], paddingBottom: gap[0], paddingLeft: gap[1], paddingRight: gap[1], boxSizing: "border-box"};
    } else if (typeof gap === "number") {
        return {paddingTop: gap, paddingBottom: gap, paddingLeft: gap, paddingRight: gap, boxSizing: "border-box"};
    } else {
        const {top, bottom, left, right} = gap;
        return {paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right, boxSizing: "border-box"};
    }
}
