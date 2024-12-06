import React from "react";
import {classNames} from "../../../../util/ClassNames";
import {AdminAppContext} from "../../context";
import {Link} from "../../../../core/Link";
import "./index.less";

export interface ExpandableProps {
    expanded: boolean;
}

export interface Props extends ExpandableProps {
    src: string;
}

export class SquareLogo extends React.PureComponent<Props> {
    static displayName = "SquareLogo";
    static contextType = AdminAppContext;
    declare context: React.ContextType<typeof AdminAppContext>;

    render() {
        const {expanded, src} = this.props;
        const {name} = this.context;
        return (
            <Link to="/">
                <div id="admin-app-default-logo" className={classNames({collapsed: !expanded})}>
                    <img src={src} />
                    <h1>{name}</h1>
                </div>
            </Link>
        );
    }
}
