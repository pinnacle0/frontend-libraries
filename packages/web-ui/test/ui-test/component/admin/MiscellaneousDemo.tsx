import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";
import {dummyEmptyCallback} from "../../util/dummyCallback";
import {AmountConditionInput, Operator} from "@pinnacle0/web-ui/core/AmountConditionInput";
import {AmountRangeInput} from "@pinnacle0/web-ui/core/AmountRangeInput";
import {ImageUploader} from "@pinnacle0/web-ui/core/ImageUploader";
import {ImageUploadResponse} from "@pinnacle0/web-ui/internal/type";
import {MultipleSelector} from "@pinnacle0/web-ui/core/MultipleSelector";
import {dummyTableColumns, generateDummyTableData, MockTableData} from "../../util/dummyTableData";
import {dummyImportCallback, dummyUploadCallback, dummyUploadURL} from "../../util/dummyUpload";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";
import {Uploader} from "@pinnacle0/web-ui/core/Uploader";
import {LocalImporter} from "@pinnacle0/web-ui/core/LocalImporter";

const tableData = generateDummyTableData(8);

const FileUploaderDemo = () => (
    <Uploader name="file" accept=".csv" uploadURL={dummyUploadURL} onUpload={dummyUploadCallback} style={{width: 300}}>
        <span>Click or Drag .csv file to here.</span>
    </Uploader>
);

const LocalImporterDemo = () => <LocalImporter type="txt" style={{width: 300, borderRadius: 65}} onImport={dummyImportCallback} />;

const ImageUploaderDemo = () => {
    const [value, setValue] = React.useState<ImageUploadResponse | null>(null);
    return <ImageUploader value={value} onChange={setValue} uploadURL={dummyUploadURL} onUpload={dummyUploadCallback} />;
};

const MultipleSelectorDemo1 = () => {
    const [data, setData] = React.useState<MockTableData[]>([]);
    return (
        <MultipleSelector
            tableColumns={dummyTableColumns}
            onChange={setData}
            value={data}
            rowKeyExtractor={_ => _.id.toString()}
            dataSource={tableData}
            renderSelectedItems={items => items.map(_ => _.name)}
            showSelectAll
            buttonText="Custome Please Select"
            disabled="table"
        />
    );
};

const MultipleSelectorDemo2 = () => {
    const [data, setData] = React.useState<MockTableData[]>([]);
    return (
        <MultipleSelector
            tableColumns={dummyTableColumns}
            onChange={setData}
            value={data}
            rowKeyExtractor={_ => _.id.toString()}
            dataSource={tableData}
            onPopoverMounted={() => MessageUtil.success("First Time Opened")}
            renderSelectedItems={items => items.map(_ => _.id + ": " + _.name)}
            renderPopover={table => (
                <div>
                    {table}
                    <b>You can select up to 3 items</b>
                </div>
            )}
            maxSelectedCount={3}
        />
    );
};

const onNumberRangeChange = (_: [number, number]) => {};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Amount Condition Input",
        showPropsHint: false,
        components: [<AmountConditionInput value={{condition: Operator.GREATER_EQUAL, amount: 43}} onChange={dummyEmptyCallback} scale={2} />],
    },
    {
        title: "Amount Range Input",
        showPropsHint: false,
        components: [
            <AmountRangeInput allowNull={false} value={[3, 5]} onChange={onNumberRangeChange} />,
            <AmountRangeInput
                allowNull
                value={[3, 5]}
                // @ts-expect-error
                onChange={onNumberRangeChange}
            />,
        ],
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
        components: [<MultipleSelectorDemo1 />, "-", <MultipleSelectorDemo2 />],
    },
];

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
