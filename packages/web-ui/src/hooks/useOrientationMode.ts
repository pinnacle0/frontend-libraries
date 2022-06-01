import React from "react";
import {OrientationUtil} from "../util/OrientationUtil";
import type {OrientationType} from "../util/OrientationUtil";

export function useOrientationMode(): OrientationType {
    const [mode, setMode] = React.useState<OrientationType>(OrientationUtil.mode());

    React.useEffect(() => {
        const handler = () => setMode(OrientationUtil.mode());
        OrientationUtil.onOrientationChange(handler);

        return () => {
            OrientationUtil.removeOnChange(handler);
        };
    }, []);

    return mode;
}
