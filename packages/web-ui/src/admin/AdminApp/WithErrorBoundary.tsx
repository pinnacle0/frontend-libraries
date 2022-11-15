import React from "react";
import {AdminPage} from "../AdminPage";

interface Props {
    onLifecycleError?: (error: unknown, componentStack: string) => void;
    children: React.ReactElement | string | number | null;
}

interface State {
    error: Error | null;
}

export class WithErrorBoundary extends React.PureComponent<Props, State> {
    static displayName = "WithErrorBoundary";

    constructor(props: Props) {
        super(props);
        this.state = {error: null};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({error});
        this.props.onLifecycleError?.(error, errorInfo.componentStack);
    }

    render() {
        const {error} = this.state;
        return error ? (
            <AdminPage>
                <AdminPage.Result type="error" title="Page Script Error" subtitle={error.message} />
            </AdminPage>
        ) : (
            this.props.children
        );
    }
}
