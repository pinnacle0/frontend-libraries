import AntDrawer from "antd/lib/drawer";
import AntLayout from "antd/lib/layout";
import UserOutlined from "@ant-design/icons/UserOutlined";
import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import {Switch, Route} from "react-router-dom";
import React from "react";
import {Menu} from "./Menu";
import {Navigator} from "./Navigator";
import {NotFound} from "./NotFound";
import {AdminPage} from "../AdminPage";
import {BoolSwitch} from "../../core/BoolSwitch";
import {Button} from "../../core/Button";
import {LocaleSelect} from "../../core/LocaleSelect";
import {i18n} from "../../internal/i18n/admin";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {TextUtil} from "../../internal/TextUtil";
import type {AdminNavigatorBase, NavigationModuleItem} from "../../util/AdminNavigatorBase";
import type {AdminAppContextType} from "./context";
import {AdminAppContext} from "./context";
import "antd/lib/drawer/style";
import "antd/lib/layout/style";
import "./index.less";

type DrawerUserInfo = {[title: string]: React.ReactElement | string | null};

/**
 * CAVEAT:
 * 1) Keep SAME object reference if props.badges/drawerUserInfo do not change, for rendering performance.
 *
 * 2) Wrap <BrowserRouter> outside MainLayout if needed.
 */
// TODO: refactor:
//  - remove logo, add {logoComponent?: React.ComponentType<{expanded: boolean}>}
//  - remove onLogout/drawerUserInfo/supportMultiLanguage, add {navigatorSideComponent?: React.ComponentType<{expanded: boolean}>}
//  - ref Ant Design Pro, collapse button move to Menu bottom
//  - only keep navigator +  (in single row) in <AntLayout.Header>
export interface Props {
    logo: string;
    name: string;
    navigationService: AdminNavigatorBase<any, any>;
    onLogout: () => void;
    badges?: {[pureURL: string]: number};
    drawerUserInfo?: DrawerUserInfo;
    welcomeComponent?: React.ComponentType;
    supportMultiLanguage?: boolean;
    // TODO: rename sideMenuWidth
    siderWidth?: number;
}

interface State {
    showDrawer: boolean;
    menuExpanded: boolean;
    soundEnabled: boolean;
}

export class AdminApp extends React.PureComponent<Props, State> {
    static displayName = "AdminApp";

    private readonly menuExpandedKey = "admin-menu-expanded";
    private readonly soundEnabledKey = "admin-sound-enabled";
    private readonly navigationModules: NavigationModuleItem<any, any>[];
    private readonly adminAppContext: AdminAppContextType;
    private registeredTitleUpdater: undefined | ((title: string | null) => void);

    constructor(props: Props) {
        super(props);
        this.state = {
            showDrawer: false,
            menuExpanded: LocalStorageUtil.getBool(this.menuExpandedKey, true),
            soundEnabled: LocalStorageUtil.getBool(this.soundEnabledKey, true),
        };
        this.navigationModules = props.navigationService.modules();
        this.adminAppContext = {
            updateTitle: title => this.registeredTitleUpdater?.(title),
            registerTitleUpdater: fn => (this.registeredTitleUpdater = fn),
        };
    }

    toggleMenuExpansion = () => {
        const newValue = !this.state.menuExpanded;
        this.setState({menuExpanded: newValue});
        LocalStorageUtil.setBool(this.menuExpandedKey, newValue);
    };

    toggleNotificationSound = () => {
        const newValue = !this.state.soundEnabled;
        this.setState({soundEnabled: newValue});
        LocalStorageUtil.setBool(this.soundEnabledKey, newValue);
    };

    openDrawer = () => this.setState({showDrawer: true});

    closeDrawer = () => this.setState({showDrawer: false});

    renderDrawerContent = () => {
        const {drawerUserInfo, badges, onLogout, supportMultiLanguage} = this.props;
        const {soundEnabled} = this.state;
        const t = i18n();
        const completedDrawerInfo: DrawerUserInfo = {
            ...drawerUserInfo,
            [t.notificationSound]: badges ? <BoolSwitch.OnOff value={soundEnabled} onChange={this.toggleNotificationSound} /> : null,
            [t.language]: supportMultiLanguage ? <LocaleSelect /> : null,
        };
        return (
            <div id="admin-app-drawer">
                <UserOutlined className="avatar" />
                <div className="grid">
                    {Object.entries(completedDrawerInfo).map(([title, node], index) => {
                        if (node) {
                            return (
                                <div className="row" key={index}>
                                    <b className="label">{title}</b>
                                    {node}
                                </div>
                            );
                        }
                    })}
                </div>
                <div className="bottom">
                    <Button size="large" onClick={onLogout}>
                        {t.logout}
                    </Button>
                </div>
            </div>
        );
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
        const {name, logo, navigationService, badges, welcomeComponent, siderWidth} = this.props;
        const {showDrawer, menuExpanded, soundEnabled} = this.state;
        return (
            <AdminAppContext.Provider value={this.adminAppContext}>
                <AntLayout id="admin-app">
                    <AntLayout.Sider collapsed={!menuExpanded} width={siderWidth}>
                        <Menu navigationService={navigationService} menuExpanded={menuExpanded} soundEnabled={soundEnabled} siteLogo={logo} siteName={name} badges={badges} />
                    </AntLayout.Sider>
                    <AntLayout>
                        <AntLayout.Header>
                            <div className="top">
                                <div className="toggle-menu-icon" onClick={this.toggleMenuExpansion}>
                                    {menuExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                                </div>
                                <Button className="drawer-button" color="wire-frame" onClick={this.openDrawer}>
                                    <UserOutlined />
                                </Button>
                            </div>
                            <Navigator navigationService={navigationService} />
                        </AntLayout.Header>
                        <AntLayout.Content>
                            <Switch>
                                <Route exact path="/" component={welcomeComponent || this.renderWelcome} />
                                {this.navigationModules.map(({url, routeParameter, componentType}) => (
                                    <Route exact key={url} path={routeParameter ? url + routeParameter : url} component={componentType} />
                                ))}
                                <Route component={NotFound} />
                            </Switch>
                        </AntLayout.Content>
                    </AntLayout>
                    <AntDrawer visible={showDrawer} width={350} closable={false} onClose={this.closeDrawer}>
                        {this.renderDrawerContent()}
                    </AntDrawer>
                </AntLayout>
            </AdminAppContext.Provider>
        );
    }
}
