import React from "react";
import type {RouteComponentProps} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {Link} from "@pinnacle0/web-ui/core/Link";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import type {Location} from "history";

export const NavigationHistoryDemo = (props: RouteComponentProps<{tab?: string}>) => {
    const tab = props.match.params.tab || "default";
    const location = useLocation();
    const historyState = useLocation().state;

    const groups: DemoHelperGroupConfig[] = [
        {
            title: `Switch Tab (Current: ${tab})`,
            components: [<Link to="/admin/navigation-history/a">Tab A</Link>, <Link to="/admin/navigation-history/b">Tab B</Link>, <Link to="/admin/navigation-history">Default Tab</Link>],
        },
        {
            title: `Update History (Current: ${historyState ? JSON.stringify(historyState) : "[NULL]"})`,
            components: [
                <Link to={{...location, state: {test: 123, page: 10}} as Location}>Some State Of Current Tab</Link>,
                <Link to={{...location, pathname: "/admin/navigation-history/c", state: {test: 456, page: 20}} as Location}>Some State Of Tab C</Link>,
            ],
        },
        {
            title: `Open Detail (Separate Tab)`,
            components: [<Link to="/admin/separate-tab-detail/88">Detail 88</Link>, <Link to="/admin/separate-tab-detail/99">Detail 99</Link>],
        },
    ];
    return <DemoHelper groups={groups} />;
};
