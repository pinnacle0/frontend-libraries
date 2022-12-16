import React from "react";
import {withRouter} from "react-router-dom";
import AntMenu from "antd/es/menu";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {MediaUtil} from "../../util/MediaUtil";
import {Badge} from "../../core/Badge";
import {AdminAppContext} from "./context";
import type {RouteComponentProps} from "react-router-dom";
import "antd/es/menu/style";
import {AdminNavigationUtil} from "../../util/AdminNavigationUtil";
import type {NavigationGroupItem} from "../../util/AdminNavigationUtil";

interface Props<Feature, Field> extends RouteComponentProps {
    siteName: string;
    permissions: Feature[];
    superAdminPermission: Feature;
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    menuExpanded: boolean;
    badges?: {[key: string]: number};
}

interface State {
    currentOpenedMenuKey: string | null;
    currentSelectedMenuKey: string | null;
}

class RouterAwareMenu<Feature, Field> extends React.PureComponent<Props<Feature, Field>, State> {
    static displayName = "Menu";
    static contextType = AdminAppContext;
    context!: React.ContextType<typeof AdminAppContext>;

    private readonly soundEnabledKey = "admin-sound-enabled";

    constructor(props: Props<Feature, Field>) {
        super(props);
        this.state = this.calculateMenuKeyByURL();
    }

    componentDidUpdate(prevProps: Props<Feature, Field>) {
        const {location, menuExpanded, badges} = this.props;
        if (prevProps.location.pathname !== location.pathname || prevProps.menuExpanded !== menuExpanded || prevProps.badges !== badges) {
            this.setState(this.calculateMenuKeyByURL(prevProps.badges));
        }
    }

    /**
     * Return true if any field of currentBadges > prevBadges.
     */
    shouldAlertNewBadge = (prevBadges: {[key: string]: number}, currentBadges: {[key: string]: number}): boolean => {
        for (const [key, badge] of Object.entries(currentBadges)) {
            if (prevBadges[key] === undefined || badge > prevBadges[key]) {
                return true;
            }
        }
        return false;
    };

    calculateTotalBadge = (badges: {[key: string]: number}): number => {
        const {navigationGroups, permissions, superAdminPermission} = this.props;
        let totalCount = 0;
        AdminNavigationUtil.groups(navigationGroups, permissions, superAdminPermission, false).forEach(({modules}) => {
            modules.forEach(_ => (totalCount += badges[_.url] || 0));
        });
        return totalCount;
    };

    calculateMenuKeyByURL = (prevBadges?: {[key: string]: number}): State => {
        const {location, menuExpanded, siteName, badges, navigationGroups, permissions, superAdminPermission} = this.props;
        const allNavigationGroups = AdminNavigationUtil.groups(navigationGroups, permissions, superAdminPermission, true);
        let currentOpenedMenuKey: string | null = allNavigationGroups?.[0]?.title || null; // Fallback opened key
        let currentSelectedMenuKey = null;
        const currentModule = AdminNavigationUtil.moduleByURL(location.pathname, navigationGroups, permissions, superAdminPermission);
        const totalBadgeCount = badges ? this.calculateTotalBadge(badges) : 0;
        const titlePrefix = (totalBadgeCount > 0 ? `(${totalBadgeCount}) ` : "") + siteName;
        const soundEnabled = LocalStorageUtil.getBool(this.soundEnabledKey, true);

        if (soundEnabled && prevBadges && badges && this.shouldAlertNewBadge(prevBadges, badges)) {
            MediaUtil.playAudio(require("./asset/alert.mp3"));
        }

        if (currentModule) {
            const matchedGroup = allNavigationGroups.find(_ => _.modules.includes(currentModule));
            if (matchedGroup) {
                currentOpenedMenuKey = matchedGroup.title;
                currentSelectedMenuKey = currentModule.url;
            }
            document.title = titlePrefix + " - " + currentModule.title;
        } else {
            document.title = titlePrefix;
        }

        if (!menuExpanded) {
            currentOpenedMenuKey = null; // Otherwise, AntD will pop this menu
        }

        return {currentOpenedMenuKey, currentSelectedMenuKey};
    };

    onMenuOpenChange = (openKeys: string[]) => {
        const length = openKeys.length;
        if (length === 0) {
            this.setState({currentOpenedMenuKey: null});
        } else if (length === 1) {
            this.setState({currentOpenedMenuKey: openKeys[0]});
        } else {
            const index = openKeys.indexOf(this.state.currentOpenedMenuKey!); // By logic, index should be 0/1 (length should be 2)
            if (index >= 0) {
                this.setState({currentOpenedMenuKey: openKeys[length - 1 - index]});
            }
        }
    };

    renderMenuGroup = (groupItem: NavigationGroupItem<any, any>) => {
        const {history, badges, menuExpanded} = this.props;
        let totalCount = 0;
        const children = groupItem.modules.map(({title, url}) => {
            const count = badges?.[url] || 0;
            totalCount += count;

            return {
                label: <Badge count={count}>{title}</Badge>,
                key: url,
                onClick() {
                    history.push(url);
                },
            };
        });

        const label = (
            <Badge count={totalCount}>
                {groupItem.icon} {menuExpanded ? groupItem.title : ""}
            </Badge>
        );

        return {
            children,
            label,
            key: groupItem.title,
        };
    };

    render() {
        const {navigationGroups, permissions, superAdminPermission} = this.props;
        const {currentOpenedMenuKey, currentSelectedMenuKey} = this.state;
        return (
            <AntMenu
                theme="dark"
                mode="inline"
                openKeys={currentOpenedMenuKey ? [currentOpenedMenuKey] : []}
                selectedKeys={currentSelectedMenuKey ? [currentSelectedMenuKey] : []}
                onOpenChange={this.onMenuOpenChange as any}
                items={AdminNavigationUtil.groups(navigationGroups, permissions, superAdminPermission, false).map(this.renderMenuGroup)}
            />
        );
    }
}

export const Menu = withRouter(RouterAwareMenu);
