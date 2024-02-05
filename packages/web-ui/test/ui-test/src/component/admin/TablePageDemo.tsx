import React from "react";
import {AdminPage} from "@pinnacle0/web-ui/admin/AdminPage";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import {Table} from "@pinnacle0/web-ui/core/Table";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {Pagination} from "@pinnacle0/web-ui/core/Pagination";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {Tooltip} from "@pinnacle0/web-ui/core/Tooltip";
import {DateTimeRangePicker} from "@pinnacle0/web-ui/core/DateTimeRangePicker";
import {AmountRangeInput} from "@pinnacle0/web-ui/core/AmountRangeInput";
import {generateDummyTableData, dummyTableColumns} from "../../dummy/dummyTableData";
import {dummyEmptyCallback, dummyLabelledAlertCallback} from "../../dummy/dummyCallback";

const tableData = generateDummyTableData(12);

const FilterExpansion = () => {
    return (
        <React.Fragment>
            <Form.Item label="Input">
                <Input value="Some name" onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label="Select" required>
                <EnumSelect list={["A", "B"]} value="A" onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label="Cascader">
                <Cascader data={[]} value="A" onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label="Radio">
                <EnumRadio list={["A", "B"]} value="A" onChange={dummyEmptyCallback} />
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
            <AdminPage.Filter
                loading={loading}
                expandedArea={<FilterExpansion />}
                reminder="Some Reminder Text"
                extraElements={[
                    <Button color="red" danger disabled key="1">
                        Disabled
                    </Button>,
                    <Tooltip title="Tooltip content ..." key="2">
                        <Button danger type="dashed">
                            Red Tooltip
                        </Button>
                    </Tooltip>,
                ]}
                onFinish={changeLoading}
                onReset={changeLoading}
            >
                <Form.Item label="Input">
                    <Input value="Some name" onChange={dummyEmptyCallback} />
                </Form.Item>
                <Form.Item label="Level" required>
                    <EnumSelect.Nullable value={1} list={[1, 2, 3]} onChange={dummyEmptyCallback} />
                </Form.Item>
                <Form.Item label="Long Content" required>
                    <EnumSelect.Nullable value={1} list={[1, 2, 3, "Test long long long long long long long long long etc"]} onChange={dummyEmptyCallback} />
                </Form.Item>
                <Form.Item label="Date Range" required>
                    <DateTimeRangePicker allowNull={false} value={[new Date(), new Date()]} onChange={dummyEmptyCallback} />
                </Form.Item>
                <Form.Item label="Amount Range">
                    <AmountRangeInput allowNull={false} value={[2, 5]} onChange={dummyEmptyCallback} />
                </Form.Item>
            </AdminPage.Filter>
            <AdminPage.Summary>
                Total amount: <Amount scale={2} value={98432} />
            </AdminPage.Summary>
            <Table columns={dummyTableColumns} dataSource={tableData} rowKey="index" loading={loading} />
            <Pagination
                totalCount={300}
                totalPage={20}
                pageIndex={1}
                pageSize={10}
                onPageIndexChange={dummyLabelledAlertCallback("onPageIndexChange")}
                onPageSizeChange={dummyLabelledAlertCallback("onPageSizeChange")}
            />
        </AdminPage>
    );
};
