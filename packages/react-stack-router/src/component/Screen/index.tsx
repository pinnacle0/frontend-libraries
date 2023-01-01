import React from "react";
import {RouteContext} from "../../context";
import "./index.less";

interface ScreenProps extends RouteContext {
    children: React.ReactNode;
}

export const Screen = ({children, ...restProps}: ScreenProps) => {
    return (
        <RouteContext.Provider value={restProps}>
            <div className="g-stack-router-screen">{children}</div>
        </RouteContext.Provider>
    );
};
