import type {ComponentType, FunctionComponent, ReactNode} from "react";
import {invariant} from "../invariant";

export interface RouteProps {
    path: string;
    dependOnParent?: boolean;
    component?: ComponentType<any>;
    children?: ReactNode;
}

export const Route: FunctionComponent<RouteProps> = () => {
    invariant(false, "Route should be wrappered by <Router> and should not be render directly");
};
