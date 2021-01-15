import React from "react";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {DemoHelper} from "../../DemoHelper";
import {Countdown} from "@pinnacle0/web-ui/core/Countdown";
import {Link} from "@pinnacle0/web-ui/core/Link";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";
import {VerticalMarquee} from "@pinnacle0/web-ui/core/VerticalMarquee";
import {generateDummyStrings} from "@pinnacle0/web-ui-test/ui-test/util/dummyList";
import {Markdown} from "@pinnacle0/web-ui/core/Markdown";
import {PagedList} from "@pinnacle0/web-ui/core/PagedList";
import {TextWithTooltipList} from "@pinnacle0/web-ui/core/TextWithTooltipList";
import {TabsDemo} from "./TabsDemo";
import {TagInputDemo} from "@pinnacle0/web-ui-test/ui-test/component/core/MiscellaneousDemo/TagInputDemo";
import {Breadcrumb} from "@pinnacle0/web-ui/core/Breadcrumb";
import {ImageUploader} from "@pinnacle0/web-ui/core/ImageUploader";
import {MultipleSelector} from "@pinnacle0/web-ui/core/MultipleSelector";
import type {MockTableData} from "../../../util/dummyTableData";
import {dummyTableColumns, generateDummyTableData} from "../../../util/dummyTableData";
import {dummyImportCallback, dummyUploadCallback, dummyUploadURL} from "../../../util/dummyUpload";
import {Uploader} from "@pinnacle0/web-ui/core/Uploader";
import {LocalImporter} from "@pinnacle0/web-ui/core/LocalImporter";
import type {ImageUploadResponse} from "@pinnacle0/web-ui/util/UploadUtil";
import {Pagination} from "@pinnacle0/web-ui/core/Pagination";

const DemoPagedList = () => {
    const ListItem = ({item, index}: {item: {a: number}; index: number}) => <div style={{textAlign: "center"}}>{item.a}</div>;

    const data = new Array(15).fill(0).map((_, index) => ({
        a: index,
    }));

    return <PagedList dataSource={data} renderItem={ListItem} itemWidth={45} pageSize={5} rowKey="index" />;
};

const DemoBreadcrumb = () => {
    const renderItem = (item: {name: string}, index: number) => <div>{item.name}</div>;

    const data = new Array(5).fill(0).map((_, index) => ({
        name: "test0" + index,
    }));

    return <Breadcrumb data={data} onClick={(_, index) => alert(_.name)} renderItem={renderItem} itemKey="name" />;
};

const FileUploaderDemo = () => (
    <Uploader name="file" accept=".csv" uploadURL={dummyUploadURL} onUploadFailure={dummyUploadCallback} onUploadSuccess={dummyUploadCallback} style={{width: 300}}>
        <span>Click or Drag .csv file to here.</span>
    </Uploader>
);

const LocalImporterDemo = () => <LocalImporter type="txt" style={{width: 300, borderRadius: 65}} onImport={dummyImportCallback} />;

const ImageUploaderDemo = () => {
    const [value, setValue] = React.useState<ImageUploadResponse | null>(null);
    return <ImageUploader imageURL={value?.imageURL || null} onChange={setValue} uploadURL={dummyUploadURL} onUploadFailure={dummyUploadCallback} onUploadSuccess={dummyUploadCallback} removable />;
};

const MultipleSelectorDemo = (props: {withPagination?: boolean; disabled?: "button" | "table"}) => {
    const pageSize = 5;
    const [data, setData] = React.useState<MockTableData[]>([]);
    const [page, setPage] = React.useState(1); // Start from 1
    const dataSource = React.useMemo(() => generateDummyTableData(pageSize, (page - 1) * 10 + 1), [page]);

    if (props.withPagination) {
        return (
            <MultipleSelector
                tableColumns={dummyTableColumns}
                onChange={setData}
                value={data}
                rowKey="name"
                dataSource={dataSource}
                renderButtonText="Paged Selector"
                renderTags="name"
                renderPopover={table => (
                    <div>
                        {table}
                        <Pagination onChange={setPage} totalCount={50 * pageSize} totalPage={50} pageIndex={page} />
                    </div>
                )}
            />
        );
    } else {
        const buttonText = props.disabled ? `Disabled (${props.disabled})` : "Simple Selector";
        return (
            <MultipleSelector
                tableColumns={dummyTableColumns}
                onChange={setData}
                value={data}
                rowKey="name"
                dataSource={dataSource}
                renderButtonText={buttonText}
                disabled={props.disabled}
                renderTags="name"
                onPopoverFirstRender={() => MessageUtil.success("First opened")}
            />
        );
    }
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Countdown",
        components: [
            <Countdown timeToComplete={Date.now() + 50 * 3600 * 1000} />,
            <Countdown timeToComplete={0} onComplete={() => alert("Should never alert")} />,
            <Countdown timeToComplete={Date.now() - 100000} onComplete={() => MessageUtil.success("Timer complete")} />,
            <Countdown
                timeToComplete={Date.now() + 50 * 3600 * 1000}
                renderer={(hours, minutes, seconds) => (
                    <b style={{color: "#37882a"}}>
                        Remaining: {hours} Hr {minutes} Min {seconds} Sec
                    </b>
                )}
            />,
        ],
    },
    {
        title: "SiteLink",
        components: [
            <Link to="/core/input">/Input</Link>,
            <Link to="/core/input" newTab>
                /Input (New Tab)
            </Link>,
            <Link to="https://www.google.com">Google</Link>,
            <Link to={() => alert("Hello")}>Alert</Link>,
        ],
    },
    {
        title: "VerticalMarquee",
        showPropsHint: false,
        components: [
            <div style={{height: 100}}>
                <VerticalMarquee>
                    {generateDummyStrings(10).map(entry => {
                        return <div key={entry}>{entry}</div>;
                    })}
                </VerticalMarquee>
            </div>,
            <VerticalMarquee>
                {generateDummyStrings(5).map(entry => {
                    return <div key={entry}>{entry}</div>;
                })}
            </VerticalMarquee>,
        ],
    },
    {
        title: "Markdown",
        components: [
            <Markdown>
                {"This is Markdown style syntax\nIt supports __bold__ and `highlight` text\n__Whole line in bold__\n`Whole line in highlight`\n__Bold text__ and `highlight text` mixed"}
            </Markdown>,
        ],
    },
    {
        title: "Tab",
        components: [<TabsDemo.Card />, <TabsDemo.Line />, "-", <TabsDemo.WithExtra />, "-", <TabsDemo.Button />, <TabsDemo.ArrayMode />, "-", <TabsDemo.MobileMode />],
    },
    {
        title: "PagedList",
        components: [<DemoPagedList />],
        showPropsHint: false,
    },
    {
        title: "TextWithTooltipList",
        components: [<TextWithTooltipList list={[{label: "Test 2", content: 1234}, "-", {label: "Test 2", content: 2234}]} />],
        showPropsHint: false,
    },
    {
        title: "TagInput",
        components: [<TagInputDemo />],
    },
    {
        title: "Breadcrumb",
        components: [<DemoBreadcrumb />],
        showPropsHint: false,
    },
    {
        title: "Uploader",
        showPropsHint: false,
        components: [<ImageUploaderDemo />, <FileUploaderDemo />],
    },
    {
        title: "Importer (no AJAX call)",
        showPropsHint: false,
        components: [<LocalImporterDemo />],
    },
    {
        title: "Multiple Selector",
        showPropsHint: false,
        components: [<MultipleSelectorDemo />, "-", <MultipleSelectorDemo withPagination />, "-", <MultipleSelectorDemo disabled="table" />, "-", <MultipleSelectorDemo disabled="button" />],
    },
];

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
