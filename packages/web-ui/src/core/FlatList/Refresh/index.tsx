import React from "react";
import {Loader} from "../Loader";
import "./index.less";

interface Props {
    loading: boolean;
    message?: string;
}

export const Refresh = ({loading, message}: Props) => {
    return <div className="g-flat-list-default-refresh">{loading ? <Loader /> : <span>{message ?? "release to refresh"}</span>}</div>;
};
