import React from "react";
import {Spinner} from "../Spinner";

interface Props {
    loading: boolean;
    message?: React.ReactElement | string;
    loadingMessage?: React.ReactElement | string;
}

export const Loading = (props: Props) => {
    const {loading, message, loadingMessage} = props;
    return (
        <div className="g-flat-list-loading">
            {loading ? typeof loadingMessage !== "object" ? <Spinner loading={loading} message={loadingMessage ?? "loading..."} /> : loadingMessage : message ?? "Release to refresh"}
        </div>
    );
};
