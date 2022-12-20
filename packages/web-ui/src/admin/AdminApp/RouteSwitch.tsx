import React from "react";
import {AdminNavigationUtil} from "../../util/AdminNavigationUtil";
import type {NavigationGroupItem, NavigationModuleItem} from "../../util/AdminNavigationUtil";
import {Route, Switch} from "react-router-dom";
import {WithErrorBoundary} from "./WithErrorBoundary";
import {NotFound} from "./NotFound";
import {i18n} from "../../internal/i18n/admin";
import {AdminPage} from "../AdminPage";
import {TextUtil} from "../../internal/TextUtil";
import {AdminAppContext} from "./context";

interface Props<Feature, Field> {
    permissions: Feature[];
    superAdminPermission: Feature;
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    WelcomeComponent?: React.ComponentType;
    onLifecycleError?: (error: unknown, componentStack: string) => void;
    onNotFound?: (notFoundPath: string) => void;
}

export class RouteSwitch<Feature, Field> extends React.PureComponent<Props<Feature, Field>> {
    static displayName = "RouteSwitch";
    static contextType = AdminAppContext;
    context!: React.ContextType<typeof AdminAppContext>;

    private readonly navigationModules: NavigationModuleItem<any, any>[];

    constructor(props: Props<Feature, Field>) {
        super(props);
        const enabledNavigationGroups = AdminNavigationUtil.groups(props.navigationGroups, props.permissions, props.superAdminPermission, true);
        this.navigationModules = AdminNavigationUtil.modules(enabledNavigationGroups);
    }

    renderWelcome = () => {
        const {name} = this.context;
        const t = i18n();
        return (
            <AdminPage>
                <AdminPage.Result type="success" title={TextUtil.interpolate(t.welcome, name)} subtitle={t.homePageSubtitle} hideButton />
            </AdminPage>
        );
    };

    render() {
        const {WelcomeComponent, onLifecycleError, onNotFound} = this.props;
        return (
            <Switch>
                <Route exact path="/" component={WelcomeComponent || this.renderWelcome} />
                {this.navigationModules.map(({url, routeParam, componentType: RouteComponent}) => (
                    <Route
                        exact
                        key={url}
                        path={routeParam ? url + routeParam : url}
                        component={(props: any) => (
                            <WithErrorBoundary onLifecycleError={onLifecycleError}>
                                <RouteComponent {...props} />
                            </WithErrorBoundary>
                        )}
                    />
                ))}
                <Route component={() => <NotFound onNotFound={onNotFound} />} />
            </Switch>
        );
    }
}
