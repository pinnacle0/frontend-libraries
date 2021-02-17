import React from "react";
import {AdminPage} from "../AdminPage";
import {i18n} from "../../internal/i18n/admin";

interface Props {
    onNotFound?: (notFoundPath: string) => void;
}

export class NotFound extends React.PureComponent<Props> {
    static displayName = "NotFound";

    componentDidMount() {
        this.props.onNotFound?.(location.href);
    }

    render() {
        const t = i18n();
        return (
            <AdminPage>
                <AdminPage.Result type="error" title={t.notFound} />
            </AdminPage>
        );
    }
}
