import type {ComponentType, FunctionComponent, ReactNode} from "react";
import {invariant} from "../invariant";

export interface RouteProps {
    path: string;
    singlePageOnload?: boolean;
    component?: ComponentType<any>;
    children?: ReactNode;
}

export const Route: FunctionComponent<RouteProps> = () => {
    invariant(false, "Route should be wrapped by <Router> and should not be render directly");
};
