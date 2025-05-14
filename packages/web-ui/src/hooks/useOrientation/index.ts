import React from "react";
import {OrientationUtil} from "../../util/OrientationUtil";
import type {OrientationType} from "../../util/OrientationUtil";

export function useOrientation(): OrientationType {
    const [orientation, setOrientation] = React.useState<OrientationType>(OrientationUtil.current());

    React.useEffect(() => OrientationUtil.subscribe(setOrientation), []);

    return orientation;
}
