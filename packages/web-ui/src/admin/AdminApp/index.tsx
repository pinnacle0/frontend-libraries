import React from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "../../internal/icons";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import type {NavigationGroupItem} from "../../util/AdminNavigationUtil";
import {SoundSwitch} from "./Default/SoundSwitch";
import {SquareLogo} from "./Default/SquareLogo";
import type {ExpandableProps} from "./Default/SquareLogo";
import {BrowserRouter} from "react-router-dom";
import {NavigatorSide} from "./Default/NavigatorSide";
import type {AdminAppContextType} from "./context";
import {AdminAppContext} from "./context";
import {RouteSwitch} from "./RouteSwitch";
import {Menu} from "./Menu";
import {Navigator} from "./Navigator";
import "./index.less";

export {AdminAppContext, type AdminAppContextType} from "./context";

export interface Props<Feature, Field> {
    name: string;
    permissions: Feature[];
    superAdminPermission: Feature;
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    LogoComponent?: React.ComponentType<ExpandableProps>;
    NavigatorSideComponent?: React.ComponentType;
    WelcomeComponent?: React.ComponentType;
    sideMenuWidth?: number;
    badges?: {[key: string]: number | number[]};
    noBrowserRouter?: boolean;
    onLifecycleError?: (error: unknown, componentStack: string) => void;
    onNotFound?: (notFoundPath: string) => void;
}

interface State {
    menuExpanded: boolean;
}

export class AdminApp<Feature, Field> extends React.PureComponent<Props<Feature, Field>, State> {
    static displayName = "AdminApp";

    static SquareLogo = SquareLogo;
    static SoundSwitch = SoundSwitch;
    static NavigatorSide = NavigatorSide;

    private readonly menuExpandedKey = "admin-menu-expanded";
    private readonly adminAppContext: AdminAppContextType;
    private registeredTitleUpdater: undefined | ((title: string | null) => void);

    constructor(props: Props<Feature, Field>) {
        super(props);
        this.state = {
            menuExpanded: LocalStorageUtil.getBool(this.menuExpandedKey, true),
        };
        this.adminAppContext = {
            name: props.name,
            updateTitle: title => this.registeredTitleUpdater?.(title),
            registerTitleUpdater: fn => (this.registeredTitleUpdater = fn),
        };
    }

    toggleMenuExpansion = () => {
        const newValue = !this.state.menuExpanded;
        this.setState({menuExpanded: newValue});
        LocalStorageUtil.setBool(this.menuExpandedKey, newValue);
    };

    render() {
        const {
            name,
            navigationGroups,
            permissions,
            superAdminPermission,
            WelcomeComponent,
            LogoComponent,
            NavigatorSideComponent,
            noBrowserRouter,
            badges,
            sideMenuWidth,
            onNotFound,
            onLifecycleError,
        } = this.props;
        const {menuExpanded} = this.state;
        const collapsedWidth = 80;
        const expandedWidth = sideMenuWidth || 200;

        const coreContent = (
            <AdminAppContext.Provider value={this.adminAppContext}>
                <div id="admin-app">
                    <div
                        className="admin-sider"
                        style={{
                            width: menuExpanded ? expandedWidth : collapsedWidth,
                            minWidth: menuExpanded ? expandedWidth : collapsedWidth,
                            background: "#001529",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "auto",
                            transition: "width 0.2s",
                        }}
                    >
                        {LogoComponent && <LogoComponent expanded={menuExpanded} />}
                        <Menu navigationGroups={navigationGroups} permissions={permissions} superAdminPermission={superAdminPermission} menuExpanded={menuExpanded} siteName={name} badges={badges} />
                        <div className="toggle-menu-icon" onClick={this.toggleMenuExpansion}>
                            {menuExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        </div>
                    </div>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}>
                        <div className="admin-header">
                            <Navigator navigationGroups={navigationGroups} permissions={permissions} superAdminPermission={superAdminPermission} />
                            {NavigatorSideComponent && <NavigatorSideComponent />}
                        </div>
                        <div className="admin-content" style={{flex: 1, overflow: "auto"}}>
                            <RouteSwitch
                                navigationGroups={navigationGroups}
                                permissions={permissions}
                                superAdminPermission={superAdminPermission}
                                WelcomeComponent={WelcomeComponent}
                                onLifecycleError={onLifecycleError}
                                onNotFound={onNotFound}
                            />
                        </div>
                    </div>
                </div>
            </AdminAppContext.Provider>
        );

        return noBrowserRouter ? coreContent : <BrowserRouter>{coreContent}</BrowserRouter>;
    }
}
