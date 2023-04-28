import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import AntMenu from "antd/es/menu";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {MediaUtil} from "../../util/MediaUtil";
import {Badge} from "../../core/Badge";
import {AdminNavigationUtil} from "../../util/AdminNavigationUtil";
import type {NavigationGroupItem} from "../../util/AdminNavigationUtil";

interface Badges {
    [key: string]: number;
}
interface Props<Feature, Field> {
    siteName: string;
    permissions: Feature[];
    superAdminPermission: Feature;
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    menuExpanded: boolean;
    badges?: Badges;
}

const SOUND_ENABLED_KEY = "admin-sound-enabled";

export function Menu<Feature, Field>({siteName, permissions, superAdminPermission, navigationGroups, menuExpanded, badges}: Props<Feature, Field>) {
    const [currentOpenedMenuKey, setCurrentOpenedMenuKey] = React.useState<string | null>(null);
    const [currentSelectedMenuKey, setCurrentSelectedMenuKey] = React.useState<string | null>(null);
    const [prevBadges, setPrevBadges] = React.useState<Badges | undefined>(undefined);
    const history = useHistory();
    const location = useLocation();

    const shownNavigationGroups = React.useMemo(() => AdminNavigationUtil.groups(navigationGroups, permissions, superAdminPermission, false), [navigationGroups, permissions, superAdminPermission]);
    const modules = React.useMemo(() => AdminNavigationUtil.modules(shownNavigationGroups), [shownNavigationGroups]);

    /**
     * Return true if any field of currentBadges > prevBadges.
     */
    const shouldAlertNewBadge = React.useCallback(
        (badges: Badges): boolean => {
            for (const [key, badge] of Object.entries(badges)) {
                if (prevBadges && (prevBadges[key] === undefined || badge > prevBadges[key])) {
                    return true;
                }
            }
            return false;
        },
        [prevBadges]
    );

    const calculateTotalBadge = React.useCallback(
        (badges: {[key: string]: number}): number => {
            let totalCount = 0;
            shownNavigationGroups.forEach(({modules}) => {
                modules.forEach(_ => (totalCount += badges[_.url] || 0));
            });
            return totalCount;
        },
        [shownNavigationGroups]
    );

    const calculateMenuKeyByURL = React.useCallback(() => {
        let currentOpenedMenuKey: string | null = shownNavigationGroups?.[0]?.title || null; // Fallback opened key
        let currentSelectedMenuKey = null;
        const currentModule = AdminNavigationUtil.moduleByURL(location.pathname, modules);
        const totalBadgeCount = badges ? calculateTotalBadge(badges) : 0;
        const titlePrefix = (totalBadgeCount > 0 ? `(${totalBadgeCount}) ` : "") + siteName;
        const soundEnabled = LocalStorageUtil.getBool(SOUND_ENABLED_KEY, true);

        if (soundEnabled && prevBadges && badges && shouldAlertNewBadge(badges)) {
            MediaUtil.playAudio(require("./asset/alert.mp3"));
        }

        if (currentModule) {
            const matchedGroup = shownNavigationGroups.find(_ => _.modules.includes(currentModule));
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
    }, [shownNavigationGroups, location, modules, badges, calculateTotalBadge, menuExpanded, prevBadges, shouldAlertNewBadge, siteName]);

    const onMenuOpenChange = (openKeys: string[]) => {
        const length = openKeys.length;
        if (length === 0) {
            setCurrentOpenedMenuKey(null);
        } else if (length === 1) {
            setCurrentOpenedMenuKey(openKeys[0]);
        } else {
            const index = openKeys.indexOf(currentOpenedMenuKey!); // By logic, index should be 0/1 (length should be 2)
            if (index >= 0) {
                setCurrentOpenedMenuKey(openKeys[length - 1 - index]);
            }
        }
    };

    const renderMenuGroup = (groupItem: NavigationGroupItem<any, any>) => {
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

    React.useEffect(() => {
        const {currentOpenedMenuKey, currentSelectedMenuKey} = calculateMenuKeyByURL();
        setCurrentOpenedMenuKey(currentOpenedMenuKey);
        setCurrentSelectedMenuKey(currentSelectedMenuKey);
    }, [location.pathname, menuExpanded, badges, calculateMenuKeyByURL]);

    React.useEffect(() => {
        setPrevBadges(badges);
    }, [badges]);

    return (
        <AntMenu
            theme="dark"
            mode="inline"
            openKeys={currentOpenedMenuKey ? [currentOpenedMenuKey] : []}
            selectedKeys={currentSelectedMenuKey ? [currentSelectedMenuKey] : []}
            onOpenChange={onMenuOpenChange as any}
            items={shownNavigationGroups.map(renderMenuGroup)}
        />
    );
}
