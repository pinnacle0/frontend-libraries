import React, {useMemo, useRef} from "react";
import {createBrowserHistory} from "history";
import {invariant} from "../../util/invariant";
import {Route} from "../../route";
import {useRouter} from "../../hook/useRouter";
import {RouterContext} from "../../context";
import {Route as RouteComponent} from "../Route";
import {Page} from "../Page";
import type {ReactNode, ComponentType} from "react";
import type {BrowserHistory} from "history";
import type {RouteProps as RouteComponentProps} from "../Route";
import "./index.less";

interface Props {
    children: ReactNode;
    history?: BrowserHistory;
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

export const Router = ({children, history: userHistory}: Props) => {
    const route = useMemo(() => createChildrenRoute(children), [children]);
    const historyRef = useRef(userHistory ?? createBrowserHistory());

    historyRef.current = userHistory ?? historyRef.current ?? createBrowserHistory();
    const history = historyRef.current;

    const router = useRouter(route, history);

    return (
        <RouterContext.Provider value={{history, ...router}}>
            <div className="g-stack-router">
                {router.stack.map(({param, location, component: Component}) => (
                    <Page key={location.key} param={param} search={location.search} pathname={location.pathname}>
                        <Component />
                    </Page>
                ))}
            </div>
        </RouterContext.Provider>
    );
};
