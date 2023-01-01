import React, {useEffect, useMemo} from "react";
import {createBrowserHistory} from "history";
import {invariant} from "../../util/invariant";
import {Route} from "../../route";
import {RouterContext} from "../../context";
import {Route as RouteComponent} from "../Route";
import {Router} from "../../router";
import {StackRouter} from "../StackRouter";
import type {History} from "history";
import type {ReactNode, ComponentType} from "react";
import type {RouteProps as RouteComponentProps} from "../Route";
import "./index.less";

export interface Props {
    children: ReactNode;
}

type Component = ComponentType<any>;

const createChildrenRoute = (children: ReactNode, parrentPaths: string[] = [], route: Route<Component> = new Route()) => {
    React.Children.forEach(children, element => {
        invariant(React.isValidElement(element), `${element} is not valid element`);
        invariant(element.type === RouteComponent, `<${element.type}> is not a <Route> component. All children of <Route> should be <Route> as well`);

        const props = element.props as RouteComponentProps;
        const paths = [...parrentPaths];
        paths.push(props.path);

        if (props.component) {
            route.insert(paths.join("/"), props.component);
        }

        if (props.children) {
            createChildrenRoute(props.children, paths, route);
        }
    });

    return route;
};

export function createRouter(history?: History) {
    const internalHistory = history ?? createBrowserHistory();
    const router = new Router(internalHistory);

    const push = router.push.bind(router);
    const pop = router.pop.bind(router);
    const replace = router.replace.bind(router);
    const reset = router.reset.bind(router);

    const Container = ({children}: Props) => {
        const route = useMemo(() => createChildrenRoute(children), [children]);
        const historyRef = React.useRef(internalHistory);
        historyRef.current = internalHistory;

        router.updateRoute(route);

        useEffect(() => {
            router.initialize();
        }, []);

        return (
            <RouterContext.Provider value={{history: historyRef.current, push, pop, replace, reset}}>
                <StackRouter router={router} />
            </RouterContext.Provider>
        );
    };

    return {
        Root: Container,
        Route: RouteComponent,
        push,
        pop,
        replace,
        reset,
    };
}
