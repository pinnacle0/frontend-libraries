import AntLayout from "antd/lib/layout";
import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import {Switch, Route} from "react-router-dom";
import React from "react";
import {Menu} from "./Menu";
import {Navigator} from "./Navigator";
import {NotFound} from "./NotFound";
import {AdminPage} from "../AdminPage";
import {i18n} from "../../internal/i18n/admin";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {TextUtil} from "../../internal/TextUtil";
import type {AdminNavigatorBase, NavigationModuleItem} from "../../util/AdminNavigatorBase";
import type {AdminAppContextType} from "./context";
import {AdminAppContext} from "./context";
import {SoundSwitch} from "./Default/SoundSwitch";
import {SquareLogo} from "./Default/SquareLogo";
import type {ExpandableProps} from "./Default/SquareLogo";
import {NavigatorSide} from "./Default/NavigatorSide";
import "antd/lib/drawer/style";
import "antd/lib/layout/style";
import "./index.less";

/**
 * CAVEAT:
 * 1) Keep SAME object reference if props.badges/drawerUserInfo do not change, for rendering performance.
 *
 * 2) Wrap <BrowserRouter> outside MainLayout if needed.
 */

export interface Props {
    name: string;
    navigationService: AdminNavigatorBase<any, any>;
    LogoComponent?: React.ComponentType<ExpandableProps>;
    NavigatorSideComponent?: React.ComponentType;
    WelcomeComponent?: React.ComponentType;
    sideMenuWidth?: number;
    badges?: {[key: string]: number};
}

interface State {
    menuExpanded: boolean;
}

export class AdminApp extends React.PureComponent<Props, State> {
    static displayName = "AdminApp";

    static Default = Object.freeze({SquareLogo, SoundSwitch, NavigatorSide});

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
            baseTitle: props.name,
            updateTitle: title => this.registeredTitleUpdater?.(title),
            registerTitleUpdater: fn => (this.registeredTitleUpdater = fn),
        };
    }

    toggleMenuExpansion = () => {
        const newValue = !this.state.menuExpanded;
        this.setState({menuExpanded: newValue});
        LocalStorageUtil.setBool(this.menuExpandedKey, newValue);
    };

    renderWelcome = () => {
        const {name} = this.props;
        const t = i18n();
        return (
            <AdminPage>
                <AdminPage.Result type="success" title={TextUtil.interpolate(t.welcome, name)} subtitle={t.homePageSubtitle} hideButton />
            </AdminPage>
        );
    };

    render() {
        const {name, navigationService, WelcomeComponent, LogoComponent, NavigatorSideComponent, badges, sideMenuWidth} = this.props;
        const {menuExpanded} = this.state;
        return (
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
                            <Switch>
                                <Route exact path="/" component={WelcomeComponent || this.renderWelcome} />
                                {this.navigationModules.map(({url, routeParameter, componentType}) => (
                                    <Route exact key={url} path={routeParameter ? url + routeParameter : url} component={componentType} />
                                ))}
                                <Route component={NotFound} />
                            </Switch>
                        </AntLayout.Content>
                    </AntLayout>
                </AntLayout>
            </AdminAppContext.Provider>
        );
    }
}
