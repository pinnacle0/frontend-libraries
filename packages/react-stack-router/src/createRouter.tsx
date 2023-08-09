import React, {useEffect, useMemo} from "react";
import {createBrowserHistory} from "history";
import {invariant} from "./invariant";
import {Route} from "./route";
import {RouterContext} from "./context";
import {Stack} from "./component/Stack";
import {Route as RouteComponent} from "./component/Route";
import {StackRouter} from "./stackRouter";
import type {History} from "history";
import type {RouteProps as RouteComponentProps} from "./component/Route";
import type {StackRoutePattern, StackRoutePayload} from "./stackRouter";
import type {Router} from "./type";

const createChildrenRoute = (children: React.ReactNode, parentPattern: StackRoutePattern | null, route: Route<StackRoutePayload> = new Route()) => {
    React.Children.forEach(children, element => {
        if (element === null || element === undefined) return;
        invariant(React.isValidElement(element), `${element} is not valid element`);
        invariant(element.type === RouteComponent, `<${element.type}> is not a <Route> component. All children of <Route> should be <Route> as well`);

        const props = element.props as RouteComponentProps;

        const patterns: string[] = [];
        let parent = parentPattern;
        while (parent) {
            patterns.unshift(parent.pattern);
            parent = parent.parent;
        }

        const pattern: StackRoutePattern = {pattern: props.path, parent: parentPattern, hasComponent: false};

        if ("component" in props) {
            pattern.hasComponent = true;
            route.insert([...patterns, props.path].join("/"), {pattern, component: props.component});
        }

        if (props.children) {
            createChildrenRoute(props.children, pattern, route);
        }
    });

    return route;
};

export type CreateRouterOptions = {
    transitionDuration?: number;
};

export function createRouter(history?: History, options?: CreateRouterOptions): Router {
    const internalHistory = history ?? createBrowserHistory();
    const router = new StackRouter({history: internalHistory, transitionDuration: options?.transitionDuration ?? 400});

    const push = router.push.bind(router);
    const pop = router.pop.bind(router);
    const replace = router.replace.bind(router);
    const replaceHash = router.replaceHash.bind(router);
    const replaceSearchParams = router.replaceSearchParams.bind(router);
    const replaceLocationState = router.replaceLocationState.bind(router);

    const Root = ({children}: React.PropsWithChildren) => {
        const route = useMemo(() => createChildrenRoute(children, null), [children]);

        router.updateRoute(route);

        useEffect(() => {
            router.attachSafariEdgeSwipeDetector();
            router.initialize();
        }, []);

        return (
            <RouterContext.Provider value={{history: internalHistory, push, pop, replace, replaceHash, replaceSearchParams, replaceLocationState}}>
                <Stack router={router} />
            </RouterContext.Provider>
        );
    };

    return {
        Root,
        Route: RouteComponent,
        push,
        pop,
        replace,
        replaceHash,
        replaceSearchParams,
        replaceLocationState,
    };
}
