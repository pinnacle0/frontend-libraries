import type {ComponentType, FunctionComponent, ReactNode} from "react";
import {invariant} from "../util/invariant";

export interface RouteProps {
    path: string;
    component?: ComponentType<any>;
    children?: ReactNode;
}

export const Route: FunctionComponent<RouteProps> = () => {
    invariant(false, "Route should be wrappered by <Route> and should not be render directly");
};
