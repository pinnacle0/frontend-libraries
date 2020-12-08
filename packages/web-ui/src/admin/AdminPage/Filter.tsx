import DownOutlined from "@ant-design/icons/DownOutlined";
import UpOutlined from "@ant-design/icons/UpOutlined";
import React from "react";
import {Form} from "../../core/Form";
import {Button} from "../../core/Button";
import {WithExplanation} from "../../core/WithExplanation";
import {SafeReactChildren} from "../../internal/type";
import {LocalStorageUtil} from "../../internal/LocalStorageUtil";
import {i18n} from "../../internal/i18n/admin";
import {FormErrorDisplayMode} from "../../core/Form/context";

export interface ExtraButtonConfig {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
    disabled?: boolean;
}

export interface Props {
    onFinish: () => void;
    onReset: () => void;
    children: SafeReactChildren;
    extraButtons?: ExtraButtonConfig | ExtraButtonConfig[];
    expandedArea?: React.ReactElement; // If undefined, the Filter cannot be expanded
    loading?: boolean;
    reminder?: string;
}

interface State {
    expanded: boolean;
}

export class Filter extends React.PureComponent<Props, State> {
    // eslint-disable-next-line @pinnacle0/react-component-display-name -- inner static component
    static displayName = "AdminPage.Filter";

    private readonly errorDisplayMode: FormErrorDisplayMode = {type: "popover", placement: "top"};
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

    renderExpansion = () => {
        const {expandedArea} = this.props;
        if (expandedArea) {
            const {expanded} = this.state;
            const t = i18n();
            return (
                <React.Fragment>
                    <div className="expand-button" onClick={this.toggleExpansion}>
                        {expanded ? <UpOutlined /> : <DownOutlined />}
                        {expanded ? t.expand : t.collapse}
                    </div>
                    <div className={`more-filter-area ${expanded ? "expanded" : ""}`}>{expandedArea}</div>
                </React.Fragment>
            );
        }
    };

    renderExtraButton = (config: ExtraButtonConfig) => {
        const {label, onClick, icon, disabled} = config;
        return (
            <Button color="wire-frame" onClick={onClick} disabled={disabled} key={label}>
                {icon} {label}
            </Button>
        );
    };

    render() {
        const {onFinish, onReset, extraButtons, reminder, loading, children} = this.props;
        const t = i18n();
        return (
            <Form className="g-admin-page-filter" onFinish={onFinish} layout="inline" errorDisplayMode={this.errorDisplayMode}>
                {children}
                {reminder && (
                    <Form.Item className="reminder">
                        <WithExplanation explanation={reminder} />
                    </Form.Item>
                )}
                <Button type="submit" disabled={loading}>
                    {t.search}
                </Button>
                <Button color="wire-frame" onClick={onReset} disabled={loading}>
                    {t.reset}
                </Button>
                {extraButtons && (Array.isArray(extraButtons) ? extraButtons.map(this.renderExtraButton) : this.renderExtraButton(extraButtons))}
                {this.renderExpansion()}
            </Form>
        );
    }
}
