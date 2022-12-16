import type {Gap} from "./type";

export const useGap = (gap?: Gap): React.CSSProperties => {
    if (!gap) return {};
    if (typeof gap === "number") {
        return {paddingTop: gap, paddingBottom: gap, paddingLeft: gap, paddingRight: gap};
    } else {
        const {top, bottom, left, right} = gap;
        return {paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right};
    }
};
