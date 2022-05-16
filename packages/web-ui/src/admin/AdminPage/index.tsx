import React from "react";
import {classNames} from "../../util/ClassNames";
import {Filter} from "./Filter";
import {Summary} from "./Summary";
import {SaveBar} from "./SaveBar";
import {Result} from "./Result";
import {TopBar} from "./TopBar";
import type {SafeReactChildren} from "../../internal/type";
import "./index.less";

export interface Props {
    children: SafeReactChildren;
    className?: string;
}

export class AdminPage extends React.PureComponent<Props> {
    static displayName = "AdminPage";

    static Filter = Filter;
    static Summary = Summary;
    static TopBar = TopBar;
    static SaveBar = SaveBar;
    static Result = Result;

    render() {
        const {className, children} = this.props;
        return <div className={classNames("g-admin-page", className)}>{children}</div>;
    }
}
