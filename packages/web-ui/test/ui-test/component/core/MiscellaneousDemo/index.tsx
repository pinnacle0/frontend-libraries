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
import {TagInput} from "@pinnacle0/web-ui/core/TagInput";
import {TagInputDemo} from "test/ui-test/component/core/MiscellaneousDemo/TagInputDemo";

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
        components: [<PagedList dataSource={[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]} renderItem={ListItem} itemWidth={45} pageSize={5} rowKey="index" />],
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
];

function ListItem({item, index}: {item: number; index: number}) {
    return <div style={{textAlign: "center"}}>{item}</div>;
}

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
