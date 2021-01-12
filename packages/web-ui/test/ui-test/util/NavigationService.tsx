import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import type {NavigationGroupItem} from "@pinnacle0/web-ui/util/AdminNavigatorBase";
import {AdminNavigatorBase} from "@pinnacle0/web-ui/util/AdminNavigatorBase";
import React from "react";
import {NavigationHistoryDemo} from "@pinnacle0/web-ui-test/ui-test/component/admin/NavigationHistoryDemo";
import {SeparateTabDetailDemo} from "@pinnacle0/web-ui-test/ui-test/component/admin/SeparateTabDetailDemo";
import {SelectDemo} from "@pinnacle0/web-ui-test/ui-test/component/core/SelectDemo";
import {SliderDemo} from "@pinnacle0/web-ui-test/ui-test/component/core/SliderDemo";
import {ConfigPageDemo} from "../component/admin/ConfigPageDemo";
import {MiscellaneousDemo as AdminMiscellaneousDemo} from "../component/admin/MiscellaneousDemo";
import {PermissionSelectorDemo} from "../component/admin/PermissionSelectorDemo";
import {ResultPageDemo} from "../component/admin/ResultPageDemo";
import {RichEditorDemo} from "../component/admin/RichEditorDemo";
import {TablePageDemo} from "../component/admin/TablePageDemo";
import {AmountDemo} from "../component/core/AmountDemo";
import {ButtonDemo} from "../component/core/ButtonDemo";
import {CalendarDemo} from "../component/core/CalendarDemo";
import {CarouselDemo} from "../component/core/CarouselDemo";
import {FoldableContainerDemo} from "../component/core/FoldableContainerDemo";
import {FormDemo} from "../component/core/FormDemo";
import {InputDemo} from "../component/core/InputDemo";
import {MiscellaneousDemo} from "../component/core/MiscellaneousDemo";
import {ModalDemo} from "../component/core/ModalDemo";
import {RelativeTimeDemo} from "../component/core/RelativeTimeDemo";
import {StepContainerDemo} from "../component/core/StepContainerDemo";
import {OverflowableTextDemo} from "@pinnacle0/web-ui-test/ui-test/component/core/OverflowableTextDemo";

export enum TestFeaturePermission {
    ROOT_PERMISSION = "ROOT_PERMISSION",
    JavaScript = "JavaScript",
    TypeScript = "TypeScript",
    Java = "Java",
    Rust = "Rust",
    Haskell = "Haskell",
    Kotlin = "Kotlin",
}

export enum TestFieldPermission {
    ROOT_PERMISSION = "ROOT_PERMISSION",
    Kona = "Kona",
    BlueMountain = "BlueMountain",
    KenyanAA = "KenyanAA",
    Tanzanian = "Tanzanian",
    Sulawesi = "Sulawesi",
}

export class NavigationService extends AdminNavigatorBase<TestFeaturePermission, TestFieldPermission> {
    constructor() {
        super(TestFeaturePermission.ROOT_PERMISSION, [TestFeaturePermission.ROOT_PERMISSION], TestFieldPermission.ROOT_PERMISSION, [TestFieldPermission.ROOT_PERMISSION]);
    }

    protected allGroups(): Array<NavigationGroupItem<TestFeaturePermission, TestFieldPermission>> {
        return [
            {
                title: "Core",
                icon: <FileSearchOutlined />,
                modules: [
                    {
                        url: "/core/button",
                        title: "Button",
                        componentType: ButtonDemo,
                        permissions: {
                            features: [TestFeaturePermission.TypeScript, TestFeaturePermission.JavaScript, TestFeaturePermission.Kotlin, TestFeaturePermission.Java],
                            fields: [TestFieldPermission.BlueMountain, TestFieldPermission.Tanzanian],
                        },
                    },
                    {
                        url: "/core/modal",
                        title: "Modal",
                        componentType: ModalDemo,
                    },
                    {
                        url: "/core/form",
                        title: "Form",
                        componentType: FormDemo,
                    },
                    {
                        url: "/core/amount",
                        title: "Amount",
                        componentType: AmountDemo,
                    },
                    {
                        url: "/core/input",
                        title: "Input",
                        componentType: InputDemo,
                    },
                    {
                        url: "/core/calendar",
                        title: "Calendar",
                        componentType: CalendarDemo,
                    },
                    {
                        url: "/core/Select",
                        title: "Select (DropDown)",
                        componentType: SelectDemo,
                    },
                    {
                        url: "/core/miscellaneous",
                        title: "Miscellaneous",
                        componentType: MiscellaneousDemo,
                    },
                    {
                        url: "/core/carousel",
                        title: "Carousel",
                        componentType: CarouselDemo,
                    },
                    {
                        url: "/core/step-container",
                        title: "Step Container",
                        componentType: StepContainerDemo,
                    },
                    {
                        url: "/core/foldable-container",
                        title: "Foldable Container",
                        componentType: FoldableContainerDemo,
                    },
                    {
                        url: "/core/relative-time",
                        title: "Relative Time",
                        componentType: RelativeTimeDemo,
                    },
                    {
                        url: "/core/slider",
                        title: "Slider",
                        componentType: SliderDemo,
                    },
                    {
                        url: "/core/overflowable-text",
                        title: "Overflowable Text",
                        componentType: OverflowableTextDemo,
                    },
                ],
            },
            {
                title: "Admin",
                icon: <FileSearchOutlined />,
                modules: [
                    {
                        url: "/admin/table-page",
                        title: "Table Page",
                        componentType: TablePageDemo,
                        permissions: {
                            features: [],
                            fields: [TestFieldPermission.Kona, TestFieldPermission.KenyanAA, TestFieldPermission.Sulawesi],
                        },
                    },
                    {
                        url: "/admin/config-page",
                        title: "Config Page",
                        componentType: ConfigPageDemo,
                    },
                    {
                        url: "/admin/result-page",
                        title: "Result Page",
                        componentType: ResultPageDemo,
                    },
                    {
                        url: "/admin/rich-editor",
                        title: "Rich Editor",
                        componentType: RichEditorDemo,
                    },
                    {
                        url: "/admin/miscellaneous",
                        title: "Miscellaneous",
                        // TODO/Lok: remove this, move these to core group (split if needed)
                        componentType: AdminMiscellaneousDemo,
                    },
                    {
                        url: "/admin/permission-selector",
                        title: "Permission Selector",
                        componentType: PermissionSelectorDemo,
                        permissions: {features: []},
                    },
                    {
                        url: "/admin/navigation-history",
                        title: "Navigation History",
                        routeParameter: "/:tab?",
                        componentType: NavigationHistoryDemo,
                    },
                    {
                        url: "/admin/separate-tab-detail",
                        routeParameter: "/:id",
                        title: "Detail",
                        componentType: SeparateTabDetailDemo,
                        display: "hidden",
                        separateTab: true,
                    },
                ],
            },
        ];
    }
}
