import React from "react";
import {Popover} from "../core/Popover";
import {Checkbox} from "../core/Checkbox";
import {Progress} from "../core/Progress";
import {Descriptions} from "../core/Descriptions";
import {NavigationGroupItem, NavigationModuleItem} from "../util/AdminNavigatorBase";
import {ArrayUtil} from "../internal/ArrayUtil";
import {i18n} from "../internal/i18n/admin";

export interface Props<Feature, Field = never> {
    navigationGroups: Array<NavigationGroupItem<Feature, Field>>;
    boundPermissionsCalculator?: (permissions: Feature) => Feature[];
    featureValue: Feature[];
    onFeatureChange: (value: Feature[]) => void;
    fieldValue?: Field[];
    onFieldChange?: (value: Field[]) => void;
    featurePermissionTranslator: (permission: Feature) => string;
    fieldPermissionTranslator?: (permission: Field) => string;
    editable: boolean;
    extraPermissions?: Feature[]; // Used for special permissions not in NavigationGroup
    moduleNameWidth?: number;
}

export class AdminPermissionSelector<Feature extends string, Field extends string = never> extends React.PureComponent<Props<Feature, Field>> {
    static displayName = "AdminPermissionSelector";

    private readonly navigationModuleItemContainerStyle: React.CSSProperties = {display: "flex"};
    private readonly progressStyle: React.CSSProperties = {width: "100%", lineHeight: "32px"};
    private readonly permissionCheckboxStyle: React.CSSProperties = {marginRight: 5, marginLeft: 0};
    private readonly popoverStyle: React.CSSProperties = {width: 450};
    private readonly descriptionItemStyle: React.CSSProperties = {minWidth: 450};
    private readonly checkboxStyle: React.CSSProperties = {
        width: this.props.moduleNameWidth || 130,
        height: 32,
        lineHeight: "32px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
    };

    triggerChangeEvent = (changedPermissions: Array<Feature | Field>, isChecked: boolean, isFieldPermission: boolean) => {
        const {onFeatureChange, onFieldChange, fieldValue, featureValue, editable} = this.props;
        if (editable) {
            if (isFieldPermission && fieldValue && onFieldChange) {
                const newPermissions = isChecked ? [...new Set([...fieldValue, ...(changedPermissions as Field[])])] : fieldValue.filter(_ => !(changedPermissions as Field[]).includes(_));
                onFieldChange(newPermissions);
            } else {
                const newPermissions = isChecked ? [...new Set([...featureValue, ...(changedPermissions as Feature[])])] : featureValue.filter(_ => !(changedPermissions as Feature[]).includes(_));
                onFeatureChange(newPermissions);
            }
        }
    };

    getNavigationModuleFeaturePermissions = (module: NavigationModuleItem<Feature, Field>): Feature[] => {
        if (module.permissions) {
            const permissions = [...module.permissions.features];
            return permissions;
        } else {
            return [];
        }
    };

    getNavigationModuleFieldPermission = (module: NavigationModuleItem<Feature, Field>): Field[] => {
        if (module.permissions?.fields) {
            return [...module.permissions.fields];
        } else {
            return [];
        }
    };

    getNavigationGroupFeaturePermissions = (groupItem: NavigationGroupItem<Feature, Field>): Feature[] => {
        const permissions: Feature[] = [];
        groupItem.modules.forEach(_ => {
            permissions.push(...this.getNavigationModuleFeaturePermissions(_));
        });
        return permissions;
    };

    getNavigationGroupFieldPermissions = (groupItem: NavigationGroupItem<Feature, Field>): Field[] => {
        const permissions: Field[] = [];
        groupItem.modules.forEach(_ => {
            permissions.push(...this.getNavigationModuleFieldPermission(_));
        });
        return permissions;
    };

    onPermissionChange = (checked: boolean, permission: Feature | Field, isFieldPermission: boolean) => {
        if (checked) {
            // Also trigger bound permission checked event
            if (this.props.boundPermissionsCalculator) {
                this.triggerChangeEvent(isFieldPermission ? [permission] : [permission, ...this.props.boundPermissionsCalculator(permission as Feature)], checked, isFieldPermission);
            } else {
                this.triggerChangeEvent(isFieldPermission ? [permission] : [permission], checked, isFieldPermission);
            }
        } else {
            this.triggerChangeEvent([permission], checked, isFieldPermission);
        }
    };

    renderExtraPermission = (extraPermissions: Feature[]) => {
        const t = i18n();
        const {featureValue, featurePermissionTranslator} = this.props;
        const enabledPercentage = ArrayUtil.intersectionPercentage(extraPermissions, featureValue);
        const titleNode = (
            <Checkbox value={enabledPercentage > 0} indeterminate={enabledPercentage > 0 && enabledPercentage < 100} onChange={value => this.triggerChangeEvent(extraPermissions, value, false)}>
                {t.extraPermission}
            </Checkbox>
        );
        return (
            <Descriptions>
                <Descriptions.Item label={titleNode}>
                    {extraPermissions.map(_ => (
                        <Checkbox key={_} onChange={value => this.onPermissionChange(value, _, false)} value={featureValue.includes(_)} style={this.permissionCheckboxStyle}>
                            {featurePermissionTranslator(_)}
                        </Checkbox>
                    ))}
                </Descriptions.Item>
            </Descriptions>
        );
    };

    /**
     *
     * @param permissions
     * type here is not accurate
     * Feature[] | Field[] will cause TS error
     * https://github.com/microsoft/TypeScript/issues/7294
     * https://github.com/microsoft/TypeScript/issues/36390
     */
    renderPermissionGroup = (permissions: (Feature | Field)[], isFieldPermission: boolean) => {
        if (permissions.length < 1) {
            return null;
        }
        const {featureValue, fieldValue, editable, boundPermissionsCalculator, featurePermissionTranslator, fieldPermissionTranslator} = this.props;
        const t = i18n();
        const enabledPercentage = isFieldPermission ? ArrayUtil.intersectionPercentage(permissions as Field[], fieldValue!) : ArrayUtil.intersectionPercentage(permissions as Feature[], featureValue);
        const titleNode = editable ? (
            <Checkbox value={enabledPercentage > 0} indeterminate={enabledPercentage > 0 && enabledPercentage < 100} onChange={value => this.triggerChangeEvent(permissions, value, isFieldPermission)}>
                {isFieldPermission ? t.fieldPermission : t.featurePermission}
            </Checkbox>
        ) : isFieldPermission ? (
            t.fieldPermission
        ) : (
            t.featurePermission
        );
        return (
            <Descriptions.Item label={titleNode}>
                {permissions.map(permission => {
                    const isDisabled = !editable || (!isFieldPermission && featureValue.some(_ => boundPermissionsCalculator?.(_).includes(permission as Feature)));
                    return (
                        <Checkbox
                            key={permission}
                            disabled={isDisabled}
                            onChange={value => this.onPermissionChange(value, permission, isFieldPermission)}
                            value={isFieldPermission ? fieldValue?.includes(permission as Field) || false : featureValue.includes(permission as Feature)}
                            style={this.permissionCheckboxStyle}
                        >
                            {isFieldPermission ? fieldPermissionTranslator?.(permission as Field) : featurePermissionTranslator(permission as Feature)}
                        </Checkbox>
                    );
                })}
            </Descriptions.Item>
        );
    };

    renderNavigationModule = (module: NavigationModuleItem<Feature, Field>) => {
        if (module.permissions) {
            const {featureValue, fieldValue} = this.props;
            const moduleFeaturePermissions = this.getNavigationModuleFeaturePermissions(module);
            const moduleFieldPermissions = this.getNavigationModuleFieldPermission(module);
            const enabledPercentage = ArrayUtil.intersectionPercentage([...moduleFeaturePermissions, ...moduleFieldPermissions], [...featureValue, ...(fieldValue || [])]);
            const popover = (
                <Descriptions column={1}>
                    {this.renderPermissionGroup(module.permissions.features, false)}
                    {module.permissions.fields ? this.renderPermissionGroup(module.permissions.fields, true) : null}
                </Descriptions>
            );
            return (
                <Popover overlayClassName="permission-group" placement="left" overlayStyle={this.popoverStyle} autoAdjustOverflow key={module.title} content={popover}>
                    <div style={this.navigationModuleItemContainerStyle}>
                        <Checkbox
                            value={enabledPercentage > 0}
                            indeterminate={enabledPercentage > 0 && enabledPercentage < 100}
                            onChange={value => {
                                this.triggerChangeEvent([...moduleFieldPermissions], value, true);
                                this.triggerChangeEvent([...moduleFeaturePermissions], value, false);
                            }}
                            style={this.checkboxStyle}
                        >
                            {module.title}
                        </Checkbox>
                        <Progress style={this.progressStyle} percent={enabledPercentage} size="small" showInfo={false} />
                    </div>
                </Popover>
            );
        } else {
            return null;
        }
    };

    renderNavigationGroup = (groupItem: NavigationGroupItem<Feature, Field>) => {
        const {featureValue, fieldValue} = this.props;
        const modulesWithSelectablePermissions = groupItem.modules.map(this.renderNavigationModule).filter(_ => _);
        if (modulesWithSelectablePermissions.length === 0) {
            return;
        }
        const groupFeaturePermissions = this.getNavigationGroupFeaturePermissions(groupItem);
        const groupFieldPermissions = this.getNavigationGroupFieldPermissions(groupItem);
        const enabledPercentage = ArrayUtil.intersectionPercentage([...groupFeaturePermissions, ...groupFieldPermissions], [...featureValue, ...(fieldValue || [])]);
        const titleNode = (
            <Checkbox
                value={enabledPercentage > 0}
                indeterminate={enabledPercentage > 0 && enabledPercentage < 100}
                onChange={value => {
                    this.triggerChangeEvent(groupFeaturePermissions, value, false);
                    this.triggerChangeEvent(groupFieldPermissions, value, true);
                }}
            >
                {groupItem.title}
            </Checkbox>
        );
        return (
            <Descriptions key={groupItem.title}>
                <Descriptions.Item style={this.descriptionItemStyle} label={titleNode}>
                    {modulesWithSelectablePermissions}
                </Descriptions.Item>
            </Descriptions>
        );
    };

    render() {
        const {navigationGroups, extraPermissions} = this.props;
        return (
            <div>
                {navigationGroups.map(this.renderNavigationGroup)}
                {extraPermissions && this.renderExtraPermission(extraPermissions)}
            </div>
        );
    }
}
