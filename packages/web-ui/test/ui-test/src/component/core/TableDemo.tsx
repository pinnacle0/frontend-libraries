import {Button} from "@pinnacle0/web-ui/core/Button";
import type {TableColumns} from "@pinnacle0/web-ui/core/Table";
import {Table} from "@pinnacle0/web-ui/core/Table";
import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

interface Profile {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const data: Profile[] = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
    },
    {
        key: "4",
        name: "Disabled User",
        age: 99,
        address: "Sidney No. 1 Lake Park",
    },
];

const TableWithActionButton = ({hasData = false}: {hasData?: boolean}) => {
    const columns: TableColumns<Profile> = [
        {
            title: "Name",
            renderData: _ => _.name,
            onCell: _ => ({
                colSpan: _.key === "4" ? 2 : 1,
            }),
        },
        {
            title: "Address",
            renderData: _ => _.address,
        },
        {
            title: "age",
            renderData: _ => _.age,
        },
        {
            title: "action",
            renderData: () => <Button>Click Me</Button>,
        },
    ];

    return <Table rowKey="index" dataSource={hasData ? data : []} columns={columns} headerHeight={100} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Table with Action button",
        showPropsHint: false,
        components: [<TableWithActionButton hasData />],
    },
    {
        title: "Table without Data",
        showPropsHint: false,
        components: [<TableWithActionButton />],
    },
];

export const TableDemo = () => <DemoHelper groups={groups} />;
