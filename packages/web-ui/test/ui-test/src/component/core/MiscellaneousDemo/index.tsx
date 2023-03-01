import React from "react";
import {Countdown} from "@pinnacle0/web-ui/core/Countdown";
import {Link} from "@pinnacle0/web-ui/core/Link";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";
import {VerticalMarquee} from "@pinnacle0/web-ui/core/VerticalMarquee";
import {Markdown} from "@pinnacle0/web-ui/core/Markdown";
import {PagedList} from "@pinnacle0/web-ui/core/PagedList";
import {WithTooltipList} from "@pinnacle0/web-ui/core/WithTooltipList";
import {Breadcrumb} from "@pinnacle0/web-ui/core/Breadcrumb";
import {MultipleSelector} from "@pinnacle0/web-ui/core/MultipleSelector";
import {Pagination} from "@pinnacle0/web-ui/core/Pagination";
import type {MockTableData} from "../../../dummy/dummyTableData";
import {dummyTableColumns, generateDummyTableData} from "../../../dummy/dummyTableData";
import {generateDummyStrings} from "../../../dummy/dummyList";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {DemoHelper} from "../../DemoHelper";
import {TagInputDemo} from "./TagInputDemo";
import {Button} from "@pinnacle0/web-ui/core/Button";

const DemoPagedList = () => {
    const data = new Array(15).fill(0).map((_, index) => ({a: index}));
    const ListItem = ({item}: {item: {a: number}; index: number}) => <div style={{textAlign: "center"}}>{item.a}</div>;

    return <PagedList dataSource={data} renderItem={ListItem} itemWidth={45} pageSize={5} rowKey="index" />;
};

const DemoBreadcrumb = () => {
    const renderItem = (item: {name: string}) => <div>{item.name}</div>;

    const data = new Array(5).fill(0).map((_, index) => ({
        name: "test0" + index,
    }));

    return <Breadcrumb data={data} onClick={_ => alert(_.name)} renderItem={renderItem} itemKey="name" />;
};

const VerticalMarqueeDemo = () => {
    const [data, setData] = React.useState(generateDummyStrings(10));

    const onButtonClick = () => setData(data => [...data, ...generateDummyStrings(10)]);

    return (
        <React.Fragment>
            <Button onClick={onButtonClick}>add 10 items</Button>
            <div style={{height: 150, width: 250}}>
                <VerticalMarquee>
                    {data.map(entry => {
                        return <div key={entry}>{entry}</div>;
                    })}
                </VerticalMarquee>
            </div>
        </React.Fragment>
    );
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
        components: [<VerticalMarqueeDemo />],
    },
    {
        title: "Markdown",
        components: [
            <Markdown>
                {"This is Markdown style syntax\nIt supports **bold** and __bold__ and `highlight` text\n__Whole line in bold__\n`Whole line in highlight`\n__Bold text__ and `highlight text` mixed"}
            </Markdown>,
        ],
    },
    {
        title: "PagedList",
        components: [<DemoPagedList />],
        showPropsHint: false,
    },
    {
        title: "TextWithTooltipList",
        components: [<WithTooltipList list={[{label: "Test 2", content: 1234}, "-", {label: "Test 2", content: 2234}]} />],
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
        title: "Multiple Selector",
        showPropsHint: false,
        components: [<MultipleSelectorDemo />, "-", <MultipleSelectorDemo withPagination />, "-", <MultipleSelectorDemo disabled="table" />, "-", <MultipleSelectorDemo disabled="button" />],
    },
];

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
