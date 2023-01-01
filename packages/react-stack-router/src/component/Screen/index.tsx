import React from "react";
import {RouteContext} from "../../context";
import "./index.less";

interface ScreenProps {
    param: {[key: string]: any};
    search: string;
    pathname: string;
    children: React.ReactNode;
}

export const Screen = ({param, pathname, search, children}: ScreenProps) => {
    return (
        <RouteContext.Provider value={{param, pathname, search}}>
            <div className="g-stack-router-screen">{children}</div>
        </RouteContext.Provider>
    );
};
