import React from "react";
import {Tabs} from "../../core/Tabs";
import type {RouteComponentProps} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {AdminAppContext} from "./context";
import type {AdminNavigatorBase, NavigationModuleItem} from "../../util/AdminNavigatorBase";
import {i18n} from "../../internal/i18n/admin";
import {Spin} from "../../core/Spin";

interface NavigatorTabItem {
    url: string;
    module: NavigationModuleItem<any, any>;
    historyState?: any;
    customTitle?: string | null;
}

interface Props extends RouteComponentProps {
    navigationService: AdminNavigatorBase<any, any>;
}

interface State {
    tabs: NavigatorTabItem[];
}

class RouterAwareNavigator extends React.PureComponent<Props, State> {
    static displayName = "Navigator";
    static contextType = AdminAppContext;
    context!: React.ContextType<typeof AdminAppContext>;

    constructor(props: Props) {
        super(props);
        this.state = {tabs: []};
    }

    componentDidMount() {
        // Register context
        this.context.registerTitleUpdater(title => {
            const url = this.props.location.pathname;
            const index = this.computeIndexByURL(url);
            if (index >= 0) {
                const newTabs = [...this.state.tabs];
                newTabs[index].customTitle = title;
                this.setState({tabs: newTabs});
            }
        });

        // Create initial tab, unless homepage or 404
        const {location, navigationService} = this.props;
        const url = location.pathname;
        const targetModule = navigationService.moduleByURL(url);
        if (targetModule) {
            this.setState({
                tabs: [
                    {
                        url,
                        module: targetModule,
                        historyState: location.state,
                    },
                ],
            });
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.location !== this.props.location) {
            const {tabs} = this.state;
            const newTabs = [...tabs];

            // Save the previous tab (both URL and history state)
            const prevURL = prevProps.location.pathname;
            const prevHistoryState = prevProps.location.state;
            const prevItemIndex = this.computeIndexByURL(prevURL);
            if (prevItemIndex >= 0) {
                newTabs[prevItemIndex].url = prevURL;
                newTabs[prevItemIndex].historyState = prevHistoryState;
            }

            // Then determine whether create a new tab, or update the existing tab
            const {location, navigationService} = this.props;
            const newURL = location.pathname;
            const newHistoryState = location.state;
            const newIndex = this.computeIndexByURL(newURL);
            if (newIndex >= 0) {
                // Update the existing tab
                newTabs[newIndex].url = newURL;
                newTabs[newIndex].historyState = newHistoryState;
            } else {
                // If module exists, create a new tab
                // Else, it means, the user goes to the homepage tab, so just do nothing
                const targetModule = navigationService.moduleByURL(newURL);
                if (targetModule) {
                    newTabs.push({
                        url: newURL,
                        historyState: newHistoryState,
                        module: targetModule,
                    });
                }
            }

            // Finalize the component state
            this.setState({tabs: newTabs});
        }
    }

    computeIndexByURL = (url: string): number => {
        // If url is null, then use current URL
        const {navigationService} = this.props;
        const {tabs} = this.state;
        const matchedModule = navigationService.moduleByURL(url);
        if (matchedModule) {
            if (matchedModule.separateTab) {
                return tabs.findIndex(_ => _.url === url);
            } else {
                return tabs.findIndex(_ => _.module === matchedModule);
            }
        } else {
            return -1;
        }
    };

    onTabClose = (key: string | React.MouseEvent | React.KeyboardEvent) => {
        const {history, location} = this.props;
        const {tabs} = this.state;

        const currentURL = location.pathname;
        const closedURL = key as string;
        const closedIndex = this.computeIndexByURL(closedURL);
        if (closedIndex >= 0) {
            const newTabs = [...tabs];
            newTabs.splice(closedIndex, 1);
            this.setState({tabs: newTabs});

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

    onTabChange = (url: string) => {
        const {history} = this.props;
        const index = this.computeIndexByURL(url);
        if (index >= 0) {
            // Trigger URL change, then the flow will go to componentDidUpdate
            const existedItem = this.state.tabs[index];
            history.push(existedItem.url, existedItem.historyState);
        } else {
            // Open homepage tab
            history.push("/");
        }
    };

    render() {
        const {location} = this.props;
        const {tabs} = this.state;
        const t = i18n();
        return (
            <Tabs className="navigator-bar" hideAdd onEdit={this.onTabClose} type="editable-card" activeKey={location.pathname} onChange={this.onTabChange}>
                <Tabs.TabPane tab={t.homePageTitle} key="/" closable={false} />
                {tabs.map(({customTitle, url, module}) => {
                    let tab: React.ReactElement | string;
                    if (customTitle) {
                        tab = customTitle;
                    } else if (module.separateTab) {
                        tab = (
                            <React.Fragment>
                                {module.title}
                                <Spin spinning size="small" />
                            </React.Fragment>
                        );
                    } else {
                        tab = module.title;
                    }
                    return <Tabs.TabPane tab={tab} key={url} closable />;
                })}
            </Tabs>
        );
    }
}

export const Navigator = withRouter(RouterAwareNavigator);
