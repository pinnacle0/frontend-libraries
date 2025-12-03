import {Button} from "@pinnacle0/web-ui/core/Button";
import type {TableColumn, TableRowSelection} from "@pinnacle0/web-ui/core/VirtualTable";
import {VirtualTable} from "@pinnacle0/web-ui/core/VirtualTable";
import {Modal} from "@pinnacle0/web-ui/core/Modal";
import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";

interface Profile {
    name: string;
    age: number;
    address: string;
}

const data: Profile[] = Array.from({length: 1000}, () => ({
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
}));

const extraColumns = Array.from({length: 20}, (_, idx) => ({
    title: `test col ${idx + 1}`,
    width: 70,
    renderData: () => idx + 1,
}));

const getColumns = (horizontalScroll: boolean = false): TableColumn<Profile>[] => {
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
            title: "fixed 1",
            width: 120,
            fixed: "right",
            renderData: () => "fixed 1",
        },
        {
            title: "age",
            width: 70,
            fixed: horizontalScroll ? "right" : undefined,
            renderData: _ => _.age,
        },
        {
            title: "action",
            width: 140,
            align: "right",
            fixed: horizontalScroll ? "right" : undefined,
            renderData: () => <Button>Click Me</Button>,
        },
        {
            title: "hidden column",
            width: 200,
            fixed: "right",
            renderData: () => "hidden",
            hidden: true,
        },
    ];
};

const VirtualTableWithData = ({hasData = false}: {hasData?: boolean}) => {
    return <VirtualTable rowKey="index" dataSource={hasData ? data : []} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const LoadingVirtualTable = () => <VirtualTable rowKey="index" dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} loading />;

const VirtualTableWithRowSelection = () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(Array.from({length: data.length}, (_, idx) => idx));
    const rowSelection: TableRowSelection<Profile> = {
        columnWidth: 40,
        onChange: _ => setSelectedRowKeys(_),
        getCheckboxProps: record => ({disabled: data.indexOf(record) === 0}),
        fixed: true,
        selectedRowKeys,
    };
    return <VirtualTable rowKey="index" rowSelection={rowSelection} dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />;
};

const VirtualTableWithVariousData = () => {
    const [data, setData] = React.useState<Profile[]>([]);
    const singleData = {
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    };

    const addOneData = () => setData([...data, singleData]);
    const addTenData = () => setData([...data, ...Array.from({length: 10}, () => singleData)]);
    const deleteLastData = () => setData(data.slice(0, data.length - 1));
    const deleteLastTenData = () => setData(data.slice(0, data.length - 10));

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-around", width: 800}}>
                <Button onClick={addOneData}>add 1 data</Button>
                <Button onClick={addTenData}>add 10 data</Button>
                <Button onClick={deleteLastData}>delete 1 data</Button>
                <Button onClick={deleteLastTenData}>delete 10 data</Button>
            </div>
            <VirtualTable rowKey="index" dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />
        </div>
    );
};

const VirtualTableWithVariousDataAndRowSelection = () => {
    const [data, setData] = React.useState<Profile[]>([]);
    const singleData = {
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    };

    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(Array.from({length: data.length}, (_, idx) => idx));
    const rowSelection: TableRowSelection<Profile> = {
        columnWidth: 40,
        onChange: _ => setSelectedRowKeys(_),
        getCheckboxProps: record => ({disabled: data.indexOf(record) === 0}),
        fixed: true,
        selectedRowKeys,
    };

    const addOneData = () => setData([...data, {...singleData}]);
    const addTenData = () => setData([...data, ...Array.from({length: 10}, () => ({...singleData}))]);
    const deleteLastData = () => setData(data.slice(0, data.length - 1));
    const deleteLastTenData = () => setData(data.slice(0, data.length - 10));

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-around", width: 800}}>
                <Button onClick={addOneData}>add 1 data</Button>
                <Button onClick={addTenData}>add 10 data</Button>
                <Button onClick={deleteLastData}>delete 1 data</Button>
                <Button onClick={deleteLastTenData}>delete 10 data</Button>
            </div>
            <VirtualTable rowSelection={rowSelection} rowKey="index" dataSource={data} scrollY={400} scrollX={800} columns={getColumns()} />
        </div>
    );
};

const VirtualTableWithFixedColumns = () => {
    return <VirtualTable rowKey="index" dataSource={data.slice(0, 8)} scrollY={400} scrollX={800} columns={getColumns(true)} />;
};

const VirtualTableInModal = () => {
    const [showModal, setShowModal] = React.useState(false);

    const toggleModal = React.useCallback(() => setShowModal(!showModal), [showModal]);

    return (
        <div>
            <Button onClick={toggleModal}>Show Modal</Button>
            {showModal && (
                <Modal width={1300} onCancel={toggleModal} title="Virtual Table">
                    <VirtualTable rowKey="index" dataSource={data.slice(0, 1)} scrollY={400} columns={getColumns()} />
                </Modal>
            )}
        </div>
    );
};

const VirtualTableWithDynamicSize = () => {
    const [height, setHeight] = React.useState<number | null>(300);
    const [width, setWidth] = React.useState<number | null>(300);
    const [scrollY, setScrollY] = React.useState<number | null>(null);
    const [scrollX, setScrollX] = React.useState<number | null>(null);

    return (
        <div style={{width: 800, height: 800}}>
            <div>
                Change Height
                <EnumSelect.Nullable nullText="not set" list={[300, 500, 700]} value={height} onChange={setHeight} />
            </div>
            <div>
                Change Width
                <EnumSelect.Nullable nullText="not set" list={[300, 500, 700]} value={width} onChange={setWidth} />
            </div>
            <div>
                Change Scroll Y
                <EnumSelect.Nullable nullText="not set" list={[300, 500, 700]} value={scrollY} onChange={setScrollY} />
            </div>
            <div>
                Change Scroll X
                <EnumSelect.Nullable nullText="not set" list={[300, 500, 700]} value={scrollX} onChange={setScrollX} />
            </div>
            <div style={{width: width ?? undefined, height: height ?? undefined}}>
                <VirtualTable dataSource={data.slice(0, 12)} scrollX={scrollX ?? undefined} scrollY={scrollY ?? undefined} columns={getColumns(true)} />
            </div>
        </div>
    );
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
        title: "VirtualTable with various amount of data",
        showPropsHint: false,
        components: [<VirtualTableWithVariousData />],
    },
    {
        title: "VirtualTable with various amount of data and row selection",
        showPropsHint: false,
        components: [<VirtualTableWithVariousDataAndRowSelection />],
    },
    {
        title: "VirtualTable inside Modal",
        showPropsHint: false,
        components: [<VirtualTableInModal />],
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
    {
        title: "Virtual Table With Dynamic Size",
        showPropsHint: false,
        components: [<VirtualTableWithDynamicSize />],
    },
];

export const VirtualTableDemo = () => <DemoHelper groups={groups} />;
