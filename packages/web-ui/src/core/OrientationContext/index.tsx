import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import {OrientationUtil} from "../../util/OrientationUtil";

export type Orientation = "portrait" | "landscape";

interface OrientationContext {
    orientation: Orientation;
}

export interface Props {
    children: React.ReactNode;
}

export const OrientationContext = React.createContext({} as OrientationContext);

export const OrientationContextProvider = ReactUtil.memo("OrientationContextProvider", ({children}: Props) => {
    const [currentOrientation, setCurrentOrientation] = React.useState(OrientationUtil.current());

    React.useEffect(() => OrientationUtil.subscribe(setCurrentOrientation), []);

    return <OrientationContext.Provider value={{orientation: currentOrientation}}>{children}</OrientationContext.Provider>;
});
