import React from "react";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import {AdminPage} from "@pinnacle0/web-ui/admin/AdminPage";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import {Table} from "@pinnacle0/web-ui/core/Table";
import {Pagination} from "@pinnacle0/web-ui/core/Pagination";
import {ExtraButtonConfig} from "@pinnacle0/web-ui/admin/AdminPage/Filter";
import {dummyEmptyCallback} from "../../util/dummyCallback";
import {generateDummyTableData, dummyTableColumns} from "../../util/dummyTableData";

const tableData = generateDummyTableData(12);
const extraButtons: ExtraButtonConfig[] = [
    {label: "Extra 1", onClick: dummyEmptyCallback},
    {label: "Extra 2", icon: <FileSearchOutlined />, onClick: dummyEmptyCallback, disabled: true},
];

const FilterExpansion = () => {
    return (
        <React.Fragment>
            <Form.Item label="Input 1">
                <Input value="Some name" onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label="Input 2">
                <Input value="Some name" onChange={dummyEmptyCallback} />
            </Form.Item>
        </React.Fragment>
    );
};

export const TablePageDemo = () => {
    const [loading, setLoading] = React.useState(false);
    const changeLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };
    return (
        <AdminPage>
            <AdminPage.Filter loading={loading} expandedArea={<FilterExpansion />} reminder="Some Reminder Text" extraButtons={extraButtons} onFinish={changeLoading} onReset={changeLoading}>
                <Form.Item label="Input">
                    <Input value="Some name" onChange={dummyEmptyCallback} />
                </Form.Item>
            </AdminPage.Filter>
            <AdminPage.Summary>
                Total amount: <Amount scale={2} value={98432} />
            </AdminPage.Summary>
            <Table columns={dummyTableColumns} dataSource={tableData} rowKey="index" loading={loading} />
            <Pagination totalCount={300} totalPage={20} onChange={dummyEmptyCallback} onShowSizeChange={dummyEmptyCallback} pageIndex={1} />
        </AdminPage>
    );
};
