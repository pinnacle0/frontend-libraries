import {Button} from "@pinnacle0/web-ui/core/Button";
import type {VirtualTableColumn, VirtualTableRowSelection} from "@pinnacle0/web-ui/core/VirtualTable";
import {VirtualTable} from "@pinnacle0/web-ui/core/VirtualTable";
import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

interface Profile {
    name: string;
    age: number;
    address: string;
}

const data: Profile[] = Array.from({length: 10000}, () => ({
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
}));

const extraColumns = Array.from({length: 10}, (_, idx) => ({
    title: `test col ${idx + 1}`,
    width: 70,
    renderData: () => idx + 1,
}));

const getColumns = (horizontalScroll: boolean = false): VirtualTableColumn<Profile>[] => {
    return [
        {
            title: "Name",
            width: 100,
            fixed: horizontalScroll ? "left" : undefined,
            renderData: _ => _.name,
        },
        {
            title: "Address",
            width: 120,
            fixed: horizontalScroll ? "left" : undefined,
            renderData: _ => _.address,
        },
        ...(horizontalScroll ? extraColumns : []),
        {
            title: "age",
            width: 70,
            fixed: horizontalScroll ? "right" : undefined,
            renderData: _ => _.age,
        },
        {
            title: "action",
            width: 120,
            fixed: horizontalScroll ? "right" : undefined,
            renderData: () => <Button>Click Me</Button>,
        },
    ];
};

const VirtualTableWithData = ({hasData = false}: {hasData?: boolean}) => {
    return <VirtualTable rowKey="index" rowHeight={50} dataSource={hasData ? data : []} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const LoadingVirtualTable = () => <VirtualTable rowKey="index" rowHeight={50} dataSource={[]} scrollY={400} scrollX={800} columns={getColumns()} loading />;

const VirtualTableWithRowSelection = () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(data.map((_, idx) => idx));
    const rowSelection: VirtualTableRowSelection<Profile> = {
        width: 40,
        onChange: _ => setSelectedRowKeys(_),
        disableSelection: (data, rowIndex) => rowIndex === 0,
        fixed: true,
        selectedRowKeys,
    };
    return <VirtualTable rowKey="index" rowHeight={50} rowSelection={rowSelection} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const VirtualTableWithFixedColumns = () => {
    return <VirtualTable rowKey="index" rowHeight={50} dataSource={data} scrollY={400} scrollX={800} columns={getColumns(true)} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "VirtualTable with huge amount of data",
        showPropsHint: false,
        components: [<VirtualTableWithData hasData />],
    },
    {
        title: "VirtualTable With Row Selection",
        showPropsHint: false,
        components: [<VirtualTableWithRowSelection />],
    },
    {
        title: "VirtualTable With Fixed Columns",
        showPropsHint: false,
        components: [<VirtualTableWithFixedColumns />],
    },
    {
        title: "VirtualTable without Data",
        showPropsHint: false,
        components: [<VirtualTableWithData />],
    },
    {
        title: "Loading VirtualTable",
        showPropsHint: false,
        components: [<LoadingVirtualTable />],
    },
];

export const VirtualTableDemo = () => <DemoHelper groups={groups} />;
