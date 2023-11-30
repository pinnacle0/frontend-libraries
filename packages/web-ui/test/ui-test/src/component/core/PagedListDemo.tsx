import React from "react";
import {PagedList} from "@pinnacle0/web-ui/core/PagedList";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

type DataItem = {value: string};

const demoData: DataItem[] = Array.from({length: 1000}).map((_, index) => ({
    value: `Item ${index}`,
}));

const Item = ({item}: {item: DataItem}) => {
    return <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>{item.value}</div>;
};

const Demo = () => {
    return (
        <div>
            <PagedList dataSource={demoData} rowKey="index" pageSize={10} itemWidth={50} renderItem={Item} />
        </div>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "PagedList",
        components: [<Demo />],
    },
];

export const PagedListDemo = () => <DemoHelper groups={groups} />;
