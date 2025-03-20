import React from "react";
import DownOutlined from "@ant-design/icons/DownOutlined";
import UpOutlined from "@ant-design/icons/UpOutlined";
import {classNames} from "../../util/ClassNames";
import {Form} from "../../core/Form";
import {Button} from "../../core/Button";
import {WithExplanation} from "../../core/WithExplanation";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {i18n} from "../../internal/i18n/admin";
import type {FormErrorDisplayMode} from "../../core/Form/context";
import {Space} from "../../core/Space";

export interface Props {
    onFinish: () => void;
    onReset?: () => void;
    children?: React.ReactNode;
    errorDisplayMode?: FormErrorDisplayMode;
    extraElements?: React.ReactNode;
    expandedArea?: React.ReactElement; // If undefined, the Filter cannot be expanded
    loading?: boolean;
    reminder?: string;
}

interface State {
    expanded: boolean;
}

export class Filter extends React.PureComponent<Props, State> {
    static displayName = "AdminPage.Filter";

    private readonly defaultErrorDisplayMode: FormErrorDisplayMode = {type: "popover", placement: "top"};
    private readonly storageKey: string;

    constructor(props: Props) {
        super(props);
        this.storageKey = `filter-expansion:${location.pathname}`;
        this.state = {expanded: LocalStorageUtil.getBool(this.storageKey, false)};
    }

    toggleExpansion = () => {
        const expanded = !this.state.expanded;
        this.setState({expanded});
        LocalStorageUtil.setBool(this.storageKey, expanded);
    };

    render() {
        const {onFinish, onReset, extraElements, reminder, loading, children, expandedArea, errorDisplayMode} = this.props;
        const {expanded} = this.state;
        const t = i18n();

        return (
            <Form className="g-admin-page-filter" onFinish={onFinish} layout="inline" errorDisplayMode={errorDisplayMode || this.defaultErrorDisplayMode} buttonRenderer={null}>
                {children}
                <Space>
                    {reminder && <WithExplanation explanation={reminder} />}
                    <Button type="primary" htmlType="submit" disabled={loading}>
                        {t.search}
                    </Button>
                    {onReset && (
                        <Button type="default" onClick={onReset} disabled={loading}>
                            {t.reset}
                        </Button>
                    )}
                    {extraElements}
                    {expandedArea && (
                        <div className="expand-trigger" onClick={this.toggleExpansion}>
                            {expanded ? <UpOutlined /> : <DownOutlined />}
                            {expanded ? t.collapse : t.expand}
                        </div>
                    )}
                </Space>
                <div className={classNames("expanded-area", {expanded})}>{expandedArea}</div>
            </Form>
        );
    }
}
