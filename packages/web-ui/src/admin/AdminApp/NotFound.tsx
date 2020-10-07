import React from "react";
import {AdminPage} from "../AdminPage";
import {i18n} from "../../internal/i18n/admin";

interface Props {}

export class NotFound extends React.PureComponent<Props> {
    static displayName = "NotFound";

    render() {
        const t = i18n();
        return (
            <AdminPage>
                <AdminPage.Result type="error" title={t.notFound} />
            </AdminPage>
        );
    }
}
