import type {ComponentType, FunctionComponent, ReactNode} from "react";
import {invariant} from "../util";

export interface PathRouteProps {
    path: string;
    children: ReactNode;
}

export interface ComponentRouteProps {
    path: string;
    component: ComponentType<any>;
    children?: ReactNode;
}

export type RouteProps = PathRouteProps | ComponentRouteProps;

export const Route: FunctionComponent<RouteProps> = () => {
    invariant(false, "Route should be wrapped by <Router> and should not be render directly");
};
