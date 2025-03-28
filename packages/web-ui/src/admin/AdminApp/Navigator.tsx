import React from "react";
import type {TabItem} from "../../core/Tabs";
import {Tabs} from "../../core/Tabs";
import {useHistory, useLocation} from "react-router-dom";
import {AdminAppContext} from "./context";
import {i18n} from "../../internal/i18n/admin";
import {Spin} from "../../core/Spin";
import {AdminNavigationUtil} from "../../util/AdminNavigationUtil";
import type {NavigationGroupItem, NavigationModuleItem} from "../../util/AdminNavigationUtil";

interface NavigatorTabItem {
    url: string;
    module: NavigationModuleItem<any, any>;
    historyState?: any;
    customTitle?: string | null;
}

interface Props<Feature, Field> {
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    permissions: Feature[];
    superAdminPermission: Feature;
}

export function Navigator<Feature, Field>({permissions, superAdminPermission, navigationGroups}: Props<Feature, Field>) {
    const [tabs, setTabs] = React.useState<NavigatorTabItem[]>([]);
    const location = useLocation();
    const locationRef = React.useRef(location);
    locationRef.current = location;
    const history = useHistory();
    const t = i18n();
    const context = React.use(AdminAppContext);
    const groups = React.useMemo(() => AdminNavigationUtil.groups(navigationGroups, permissions, superAdminPermission, true), [navigationGroups, permissions, superAdminPermission]);
    const modules = React.useMemo(() => AdminNavigationUtil.modules(groups), [groups]);

    const computeIndexByURL = React.useCallback(
        (url: string, tabs: NavigatorTabItem[]): number => {
            // If url is null, then use current URL
            const matchedModule = AdminNavigationUtil.moduleByURL(url, modules);
            if (matchedModule) {
                if (matchedModule.separateTab) {
                    return tabs.findIndex(_ => _.url === url);
                } else {
                    return tabs.findIndex(_ => _.module === matchedModule);
                }
            } else {
                return -1;
            }
        },
        [modules]
    );

    const onTabClose = (key: string | React.MouseEvent | React.KeyboardEvent) => {
        const currentURL = location.pathname;
        const closedURL = key as string;
        const closedIndex = computeIndexByURL(closedURL, tabs);
        if (closedIndex >= 0) {
            const newTabs = [...tabs];
            newTabs.splice(closedIndex, 1);
            setTabs(newTabs);

            if (currentURL === closedURL) {
                // Close current tab, then re-open the previous tab, or the first tab
                const followingItem = newTabs[closedIndex - 1];
                if (followingItem) {
                    history.push(followingItem.url, followingItem.historyState);
                } else {
                    history.push("/");
                }
            }
        }
    };

    const onTabChange = (url: string) => {
        const index = computeIndexByURL(url, tabs);
        if (index >= 0) {
            // Trigger URL change, then the flow will go to componentDidUpdate
            const existedItem = tabs[index];
            history.push(existedItem.url, existedItem.historyState);
        } else {
            // Open homepage tab
            history.push("/");
        }
    };

    const tabItems: TabItem[] = [
        {
            key: "/",
            label: t.homePageTitle,
            closable: false,
        },
        ...tabs.map(({customTitle, url, module}) => {
            let label: React.ReactElement | string;
            if (customTitle) {
                label = customTitle;
            } else if (module.separateTab) {
                label = (
                    <React.Fragment>
                        {module.title}
                        <Spin spinning size="small" />
                    </React.Fragment>
                );
            } else {
                label = module.title;
            }
            return {
                label,
                key: url,
                closable: true,
            };
        }),
    ];

    React.useEffect(() => {
        context.registerTitleUpdater(title => {
            setTabs(tabs => {
                const url = locationRef.current.pathname;
                const index = computeIndexByURL(url, tabs);
                const newTabs = [...tabs];
                if (index >= 0) {
                    newTabs[index].customTitle = title;
                }
                return newTabs;
            });
        });
    }, [computeIndexByURL, context]);

    React.useEffect(() => {
        setTabs(tabs => {
            const newTabs = [...tabs];
            // Determine whether create a new tab, or update the existing tab
            const newURL = location.pathname;
            const newHistoryState = location.state;
            const newIndex = computeIndexByURL(newURL, newTabs);

            if (newIndex >= 0) {
                // Update the existing tab
                newTabs[newIndex].url = newURL;
                newTabs[newIndex].historyState = newHistoryState;
            } else {
                // If module exists, create a new tab
                // Else, it means, the user goes to the homepage tab, so just do nothing
                const targetModule = AdminNavigationUtil.moduleByURL(newURL, modules);
                if (targetModule) {
                    newTabs.push({
                        url: newURL,
                        historyState: newHistoryState,
                        module: targetModule,
                    });
                }
            }
            return newTabs;
        });
    }, [location, modules, computeIndexByURL]);

    return <Tabs className="navigator-bar" hideAdd onEdit={onTabClose} type="editable-card" activeKey={location.pathname} onChange={onTabChange} items={tabItems} />;
}
