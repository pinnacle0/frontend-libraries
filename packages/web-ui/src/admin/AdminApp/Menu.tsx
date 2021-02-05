import AntMenu from "antd/lib/menu";
import "antd/lib/menu/style";
import React from "react";
import {Badge} from "../../core/Badge";
import type {AdminNavigatorBase, NavigationGroupItem} from "../../util/AdminNavigatorBase";
import type {RouteComponentProps} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {AdminAppContext} from "./context";

interface Props extends RouteComponentProps {
    siteName: string;
    navigationService: AdminNavigatorBase<any, any>;
    menuExpanded: boolean;
    badges?: {[key: string]: number};
}

interface State {
    currentOpenedMenuKey: string | null;
    currentSelectedMenuKey: string | null;
}

export const Menu = withRouter(
    class extends React.PureComponent<Props, State> {
        static displayName = "Menu";

        static contextType = AdminAppContext;
        declare context: React.ContextType<typeof AdminAppContext>;

        readonly soundEnabledKey = "admin-sound-enabled";

        constructor(props: Props) {
            super(props);
            this.state = this.calculateMenuKeyByURL();
        }

        componentDidUpdate(prevProps: Props) {
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
            let totalCount = 0;
            this.props.navigationService.groups(false).forEach(({modules}) => {
                modules.forEach(_ => (totalCount += badges[_.url] || 0));
            });
            return totalCount;
        };

        calculateMenuKeyByURL = (prevBadges?: {[key: string]: number}): State => {
            const {location, menuExpanded, siteName, badges, navigationService} = this.props;
            const allNavigationGroups = navigationService.groups(true);
            let currentOpenedMenuKey: string | null = allNavigationGroups?.[0]?.title || null; // Fallback opened key
            let currentSelectedMenuKey = null;
            const currentModule = navigationService.moduleByURL(location.pathname);
            const totalBadgeCount = badges ? this.calculateTotalBadge(badges) : 0;
            const titlePrefix = (totalBadgeCount > 0 ? `(${totalBadgeCount}) ` : "") + siteName;
            const soundEnabled = LocalStorageUtil.getBool(this.soundEnabledKey, true);

            if (soundEnabled && prevBadges && badges && this.shouldAlertNewBadge(prevBadges, badges)) {
                /**
                 * Attention:
                 * (1) For old browsers, Promise return value may be unsupported.
                 * (2) For modern browsers, if the user never has interaction with the page, play() will reject.
                 */
                try {
                    new Audio(require("./asset/alert.mp3")).play().catch(() => {});
                } catch (e) {
                    // Do nothing
                }
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
                return (
                    <AntMenu.Item key={url} onClick={() => history.push(url)}>
                        <Badge count={count}>{title}</Badge>
                    </AntMenu.Item>
                );
            });
            const title = (
                <Badge count={totalCount}>
                    {groupItem.icon} {menuExpanded ? groupItem.title : ""}
                </Badge>
            );
            return (
                <AntMenu.SubMenu title={title} key={groupItem.title}>
                    {children}
                </AntMenu.SubMenu>
            );
        };

        render() {
            const {navigationService} = this.props;
            const {currentOpenedMenuKey, currentSelectedMenuKey} = this.state;
            return (
                <AntMenu
                    theme="dark"
                    mode="inline"
                    openKeys={currentOpenedMenuKey ? [currentOpenedMenuKey] : []}
                    selectedKeys={currentSelectedMenuKey ? [currentSelectedMenuKey] : []}
                    onOpenChange={this.onMenuOpenChange as any}
                >
                    {navigationService.groups(false).map(this.renderMenuGroup)}
                </AntMenu>
            );
        }
    }
);
