import React from "react";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import {SelectDemo} from "../component/core/SelectDemo";
import {SliderDemo} from "../component/core/SliderDemo";
import {AmountDemo} from "../component/core/AmountDemo";
import {ButtonDemo} from "../component/core/ButtonDemo";
import {CalendarDemo} from "../component/core/CalendarDemo";
import {CarouselDemo} from "../component/core/CarouselDemo";
import {FoldableDemo} from "../component/core/FoldableDemo";
import {FormDemo} from "../component/core/FormDemo";
import {InputDemo} from "../component/core/InputDemo";
import {MiscellaneousDemo} from "../component/core/MiscellaneousDemo";
import {ModalDemo} from "../component/core/ModalDemo";
import {RelativeTimeDemo} from "../component/core/RelativeTimeDemo";
import {StepContainerDemo} from "../component/core/StepContainerDemo";
import {OverflowableTextDemo} from "../component/core/OverflowableTextDemo";
import {TabsDemo} from "../component/core/TabsDemo";
import {TableDemo} from "../component/core/TableDemo";
import {VirtualTableDemo} from "../component/core/VirtualTableDemo";
import {VirtualListDemo} from "../component/core/VirtualListDemo";
import {CascaderDemo} from "../component/core/CascaderDemo";
import {UploaderImporterDemo} from "../component/core/UploaderImporterDemo";
import {RenderErrorDemo} from "../component/admin/RenderErrorDemo";
import {ConfigPageDemo} from "../component/admin/ConfigPageDemo";
import {PermissionSelectorDemo} from "../component/admin/PermissionSelectorDemo";
import {ResultPageDemo} from "../component/admin/ResultPageDemo";
import {TablePageDemo} from "../component/admin/TablePageDemo";
import {NavigationHistoryDemo} from "../component/admin/NavigationHistoryDemo";
import {SeparateTabDetailDemo} from "../component/admin/SeparateTabDetailDemo";
import type {NavigationGroupItem} from "@pinnacle0/web-ui/util/AdminNavigationUtil";
import {ResizableDemo} from "../component/core/ResizableDemo";

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

export const NavigationData: NavigationGroupItem<TestFeaturePermission, TestFieldPermission>[] = [
    {
        title: "Core",
        icon: <FileSearchOutlined />,
        modules: [
            {
                url: "/core/button",
                title: "Button",
                componentType: ButtonDemo,
                featurePermissions: [TestFeaturePermission.TypeScript, TestFeaturePermission.JavaScript, TestFeaturePermission.Kotlin, TestFeaturePermission.Java],
                fieldPermissions: [TestFieldPermission.BlueMountain, TestFieldPermission.Tanzanian],
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
                title: "Select",
                componentType: SelectDemo,
            },
            {
                url: "/core/Cascader",
                title: "Cascader",
                componentType: CascaderDemo,
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
                url: "/core/foldable",
                title: "Foldable",
                componentType: FoldableDemo,
            },
            {
                url: "/core/tabs",
                title: "Tabs",
                componentType: TabsDemo,
            },
            {
                url: "/core/table",
                title: "Table",
                componentType: TableDemo,
            },
            {
                url: "/core/virtual-table",
                title: "Virtual Table",
                componentType: VirtualTableDemo,
            },
            {
                url: "/core/virtual-list",
                title: "Virtual List",
                componentType: VirtualListDemo,
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
            {
                url: "/core/miscellaneous",
                title: "Miscellaneous",
                componentType: MiscellaneousDemo,
            },
            {
                url: "/core/uploader-importer",
                title: "Uploader Importer",
                componentType: UploaderImporterDemo,
            },
            {
                url: "/core/resizable",
                title: "Resizable",
                componentType: ResizableDemo,
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
                featurePermissions: [],
                fieldPermissions: [TestFieldPermission.Kona, TestFieldPermission.KenyanAA, TestFieldPermission.Sulawesi],
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
                url: "/admin/permission-selector",
                title: "Permission Selector",
                componentType: PermissionSelectorDemo,
                featurePermissions: [],
            },
            {
                url: "/admin/render-error",
                title: "Render Error",
                componentType: RenderErrorDemo,
            },
            {
                url: "/admin/navigation-history",
                title: "Navigation History",
                routeParam: "/:tab?",
                componentType: NavigationHistoryDemo,
            },
            {
                url: "/admin/separate-tab-detail",
                routeParam: "/:id",
                title: "Detail",
                componentType: SeparateTabDetailDemo,
                display: "hidden",
                separateTab: true,
            },
        ],
    },
];
