import React from "react";
import type {TestFieldPermission} from "../../util/NavigationService";
import {NavigationService, TestFeaturePermission} from "../../util/NavigationService";
import {AdminPermissionSelector} from "@pinnacle0/web-ui/admin/AdminPermissionSelector";
import {DemoHelper} from "../DemoHelper";

export const PermissionSelectorDemo = () => {
    const navigationGroups = React.useMemo(() => new NavigationService().groups(true), []);
    const boundPermissionsCalculator = React.useCallback((permission: TestFeaturePermission) => (permission === TestFeaturePermission.TypeScript ? [TestFeaturePermission.JavaScript] : []), []);
    const [feature, setFeature] = React.useState<TestFeaturePermission[]>([]);
    const [field, setField] = React.useState<TestFieldPermission[]>([]);

    return (
        <DemoHelper
            groups={[
                {
                    title: "Permission Selector",
                    components: [
                        <AdminPermissionSelector
                            navigationGroups={navigationGroups}
                            // boundPermissionsCalculator={boundPermissionsCalculator}
                            featureValue={feature}
                            onFeatureChange={setFeature}
                            fieldValue={field}
                            onFieldChange={setField}
                            featurePermissionTranslator={_ => _}
                            fieldPermissionTranslator={_ => _}
                            extraPermissions={[TestFeaturePermission.Haskell, TestFeaturePermission.Rust]}
                            moduleNameWidth={150}
                            editable
                        />,
                    ],
                    showPropsHint: false,
                },
                {
                    title: "Permission Selector(Feature only)",
                    components: [
                        <AdminPermissionSelector
                            navigationGroups={navigationGroups}
                            featureValue={feature}
                            onFeatureChange={setFeature}
                            featurePermissionTranslator={_ => _}
                            moduleNameWidth={150}
                            editable
                        />,
                    ],
                },
                {
                    title: "Permission Selector(Feature only, always expand)",
                    components: [
                        <AdminPermissionSelector
                            navigationGroups={navigationGroups}
                            featureValue={feature}
                            onFeatureChange={setFeature}
                            featurePermissionTranslator={_ => _}
                            moduleNameWidth={150}
                            editable
                            alwaysExpand
                        />,
                    ],
                },
            ]}
        />
    );
};
