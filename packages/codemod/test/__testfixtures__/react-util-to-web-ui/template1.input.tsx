// @ts-nocheck
import React from "react";
import {ReactUtil} from "@pinnacle0/util";
import {useMainState} from "../module/main/hooks";
import type {SafeReactChildren} from "@pinnacle0/util";

interface Props {
    dark: string;
    light: string;
    children: SafeReactChildren;
}

export const BodyBackground = ReactUtil.memo("BodyBackground", ({dark, light, children}: Props) => {
    const darkMode = useMainState(state => state.darkMode);

    React.useEffect(() => {
        const url = darkMode ? dark : light;
        document.body.style.backgroundImage = `url("${url}")`;
        return () => {
            // Attention: it's background-image, not backgroundImage
            document.body.style.removeProperty("background-image");
        };
    }, [darkMode, dark, light]);

    return <React.Fragment>{children}</React.Fragment>;
});
