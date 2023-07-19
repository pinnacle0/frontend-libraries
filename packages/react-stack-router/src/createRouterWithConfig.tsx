import {type ComponentType} from "react";
import {Route} from "./route";
import {RouterContext} from "./context";
import {createBrowserHistory} from "history";
import {StackRouter} from "./stackRouter";
import {Stack} from "./component/Stack";
import type {History, To} from "history";
import type {PushOption} from "./type";

export type RouteNode = {
    component?: React.ComponentType<any>;
    children?: RouteConfig;
};

export type RouteConfig = {
    [path: string]: RouteNode;
};

type RouterRootProps = {
    history?: History;
};

type Router = {
    Root: ComponentType<RouterRootProps>;
    push: (to: To, option?: PushOption) => Promise<void>;
    pop: () => Promise<void>;
    replace: (to: To, state?: Record<string, any>) => Promise<void>;
    reset: () => void;
};

function insertChildrenRoute(route: Route<React.ComponentType<any>>, config: RouteConfig, parentPaths: string[] = []): void {
    for (const [path, node] of Object.entries(config)) {
        const paths = [...parentPaths, path];
        if (node.component) {
            route.insert(paths.join("/"), node.component);
        }

        if (node.children) {
            insertChildrenRoute(route, node.children, paths);
        }
    }
}

export function createRouterWithConfig(config: RouteConfig): Router {
    const history = createBrowserHistory();
    const router = new StackRouter(history);

    const route = new Route<React.ComponentType<any>>();
    insertChildrenRoute(route, config);
    router.updateRoute(route);

    const push = router.push.bind(router);
    const pop = router.pop.bind(router);
    const replace = router.replace.bind(router);
    const reset = router.reset.bind(router);

    function Root() {
        return (
            <RouterContext.Provider value={{history, push, pop, replace, reset}}>
                <Stack router={router} />
            </RouterContext.Provider>
        );
    }

    return {Root, push, pop, replace, reset};
}
