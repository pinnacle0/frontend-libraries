import React from "react";
import {RouteContext} from "../../context";
import "./index.less";

interface PageProps {
    param: {[key: string]: any};
    search: string;
    pathname: string;
    children: React.ReactNode;
}

export const Page: React.FunctionComponent<PageProps> = ({param, pathname, search, children}: PageProps) => {
    return (
        <RouteContext.Provider value={{param, pathname, search}}>
            <div className="g-stack-router-page">{children}</div>
        </RouteContext.Provider>
    );
};
