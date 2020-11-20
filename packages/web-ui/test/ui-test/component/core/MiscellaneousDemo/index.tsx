import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../../DemoHelper";
import {Countdown} from "@pinnacle0/web-ui/core/Countdown";
import {Link} from "@pinnacle0/web-ui/core/Link";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";
import {VerticalMarquee} from "@pinnacle0/web-ui/core/VerticalMarquee";
import {generateDummyStrings} from "test/ui-test/util/dummyList";
import {Markdown} from "@pinnacle0/web-ui/core/Markdown";
import {PagedList} from "@pinnacle0/web-ui/core/PagedList";
import {TextWithTooltipList} from "@pinnacle0/web-ui/core/TextWithTooltipList";
import {TabsDemo} from "./TabsDemo";
import {TagInputDemo} from "test/ui-test/component/core/MiscellaneousDemo/TagInputDemo";
import {Breadcrumb} from "@pinnacle0/web-ui/core/Breadcrumb";
import {DateCalendar} from "@pinnacle0/web-ui/core/DateCalendar";

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
        title: "Calendar",
        components: [<DateCalendarDemo />],
        showPropsHint: false,
    },
];

function DemoPagedList() {
    const ListItem = ({item, index}: {item: {a: number}; index: number}) => <div style={{textAlign: "center"}}>{item.a}</div>;

    const data = new Array(15).fill(0).map((_, index) => ({
        a: index,
    }));

    return <PagedList dataSource={data} renderItem={ListItem} itemWidth={45} pageSize={5} rowKey="index" />;
}

function DemoBreadcrumb() {
    const renderItem = (item: {name: string}, index: number) => <div>{item.name}</div>;

    const data = new Array(5).fill(0).map((_, index) => ({
        name: "test0" + index,
    }));

    return <Breadcrumb data={data} onClick={(_, index) => alert(_.name)} renderItem={renderItem} itemKey="name" />;
}

function DateCalendarDemo() {
    const [date, setDate] = React.useState(new Date().toISOString());

    return (
        <div style={{width: 400}}>
            <DateCalendar value={date} onChange={setDate} />
        </div>
    );
}

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
