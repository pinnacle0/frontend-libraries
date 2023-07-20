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
import type {StackRoutePayload} from "./stackRouter";
import type {Router} from "./type";

const createChildrenRoute = (children: React.ReactNode, parentPaths: string[] = [], route: Route<StackRoutePayload> = new Route()) => {
    React.Children.forEach(children, element => {
        invariant(React.isValidElement(element), `${element} is not valid element`);
        invariant(element.type === RouteComponent, `<${element.type}> is not a <Route> component. All children of <Route> should be <Route> as well`);

        const props = element.props as RouteComponentProps;
        const paths = [...parentPaths];
        paths.push(props.path);

        if ("component" in props) {
            route.insert(paths.join("/"), {component: props.component, singlePageOnload: props.singlePageOnload ?? false});
        }

        if (props.children) {
            createChildrenRoute(props.children, paths, route);
        }
    });

    return route;
};

export function createRouter(history?: History): Router {
    const internalHistory = history ?? createBrowserHistory();
    const router = new StackRouter(internalHistory);

    const push = router.push.bind(router);
    const pop = router.pop.bind(router);
    const replace = router.replace.bind(router);
    const reset = router.reset.bind(router);

    const Root = ({children}: React.PropsWithChildren) => {
        const route = useMemo(() => createChildrenRoute(children), [children]);
        const historyRef = React.useRef(internalHistory);
        historyRef.current = internalHistory;

        router.updateRoute(route);

        useEffect(() => router.initialize(), []);

        return (
            <RouterContext.Provider value={{history: historyRef.current, push, pop, replace, reset}}>
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
        reset,
    };
}
