import React from "react";
import {Tooltip} from "@pinnacle0/web-ui/core/Tooltip";
import "./index.less";

export interface DemoHelperGroupConfig {
    title: string;
    /**
     * "-": line break
     * " ": extra space
     */
    components: Array<React.ReactElement | "-" | " ">;
    /**
     * If true, it will use Tooltip to show the props of current component
     * Default: true
     */
    showPropsHint?: boolean;
    style?: React.CSSProperties;
}

export interface Props {
    groups: DemoHelperGroupConfig[];
    style?: React.CSSProperties;
}

export const DemoHelper = ({groups, style}: Props) => {
    return (
        <div className="demo-helper-container">
            {groups.map(({title, components, style: groupStyle, showPropsHint}) => (
                <div className="group" key={title}>
                    <h2>{title}</h2>
                    <div className="components" style={{...style, ...groupStyle}}>
                        {components.map((component, index) =>
                            component === "-" ? (
                                <div key={index} className="line-break" />
                            ) : component === " " ? (
                                <div key={index} className="space" />
                            ) : showPropsHint === false ? (
                                <div key={index}>{component}</div>
                            ) : (
                                <Tooltip
                                    placement="right"
                                    key={index}
                                    overlayStyle={{maxWidth: "unset"}}
                                    title={<pre style={{minWidth: "max-content"}}>{JSON.stringify(component.props, null, 2)}</pre>}
                                >
                                    <div>{component}</div>
                                </Tooltip>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
