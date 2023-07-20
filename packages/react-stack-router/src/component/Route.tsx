import type {ComponentType, FunctionComponent, ReactNode} from "react";
import {invariant} from "../invariant";

export interface PathRouteProps {
    path: string;
    component: ComponentType<any>;
    hildren: ReactNode;
}

export interface ComponentRouteProps {
    path: string;
    component: ComponentType<any>;
    singlePageOnload?: boolean;
    children?: ReactNode;
}

export type RouteProps = PathRouteProps | ComponentRouteProps;

export const Route: FunctionComponent<RouteProps> = () => {
    invariant(false, "Route should be wrapped by <Router> and should not be render directly");
};
