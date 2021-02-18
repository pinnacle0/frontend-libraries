import React from "react";
import AntLayout from "antd/lib/layout";
import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import type {AdminNavigatorBase, NavigationModuleItem} from "../../util/AdminNavigatorBase";
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
import "antd/lib/drawer/style";
import "antd/lib/layout/style";
import "./index.less";

export interface Props {
    name: string;
    navigationService: AdminNavigatorBase<any, any>;
    LogoComponent?: React.ComponentType<ExpandableProps>;
    NavigatorSideComponent?: React.ComponentType;
    WelcomeComponent?: React.ComponentType;
    sideMenuWidth?: number;
    badges?: {[key: string]: number};
    noBrowserRouter?: boolean;
    onLifecycleError?: (error: unknown, componentStack: string) => void;
    onNotFound?: (notFoundPath: string) => void;
}

interface State {
    menuExpanded: boolean;
}

export class AdminApp extends React.PureComponent<Props, State> {
    static displayName = "AdminApp";

    static SquareLogo = SquareLogo;
    static SoundSwitch = SoundSwitch;
    static NavigatorSide = NavigatorSide;

    private readonly menuExpandedKey = "admin-menu-expanded";
    private readonly navigationModules: NavigationModuleItem<any, any>[];
    private readonly adminAppContext: AdminAppContextType;
    private registeredTitleUpdater: undefined | ((title: string | null) => void);

    constructor(props: Props) {
        super(props);
        this.state = {
            menuExpanded: LocalStorageUtil.getBool(this.menuExpandedKey, true),
        };
        this.navigationModules = props.navigationService.modules();
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
        const {name, navigationService, WelcomeComponent, LogoComponent, NavigatorSideComponent, noBrowserRouter, badges, sideMenuWidth, onNotFound, onLifecycleError} = this.props;
        const {menuExpanded} = this.state;
        const coreContent = (
            <AdminAppContext.Provider value={this.adminAppContext}>
                <AntLayout id="admin-app">
                    <AntLayout.Sider collapsed={!menuExpanded} width={sideMenuWidth}>
                        {LogoComponent && <LogoComponent expanded={menuExpanded} />}
                        <Menu navigationService={navigationService} menuExpanded={menuExpanded} siteName={name} badges={badges} />
                        <div className="toggle-menu-icon" onClick={this.toggleMenuExpansion}>
                            {menuExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        </div>
                    </AntLayout.Sider>
                    <AntLayout>
                        <AntLayout.Header>
                            <Navigator navigationService={navigationService} />
                            {NavigatorSideComponent && <NavigatorSideComponent />}
                        </AntLayout.Header>
                        <AntLayout.Content>
                            <RouteSwitch navigationService={navigationService} WelcomeComponent={WelcomeComponent} onLifecycleError={onLifecycleError} onNotFound={onNotFound} />
                        </AntLayout.Content>
                    </AntLayout>
                </AntLayout>
            </AdminAppContext.Provider>
        );

        return noBrowserRouter ? coreContent : <BrowserRouter>{coreContent}</BrowserRouter>;
    }
}
