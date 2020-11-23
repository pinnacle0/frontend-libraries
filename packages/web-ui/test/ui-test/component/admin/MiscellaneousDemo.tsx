import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";
import {dummyEmptyCallback} from "../../util/dummyCallback";
import {AmountConditionInput, Operator} from "@pinnacle0/web-ui/core/AmountConditionInput";
import {AmountRangeInput} from "@pinnacle0/web-ui/core/AmountRangeInput";
import {ImageUploader} from "@pinnacle0/web-ui/core/ImageUploader";
import {MultipleSelector} from "@pinnacle0/web-ui/core/MultipleSelector";
import {dummyTableColumns, generateDummyTableData, MockTableData} from "../../util/dummyTableData";
import {dummyImportCallback, dummyUploadCallback, dummyUploadURL} from "../../util/dummyUpload";
import {MessageUtil} from "@pinnacle0/web-ui/util/MessageUtil";
import {Uploader} from "@pinnacle0/web-ui/core/Uploader";
import {LocalImporter} from "@pinnacle0/web-ui/core/LocalImporter";
import {ImageUploadResponse} from "@pinnacle0/web-ui/util/UploadUtil";

const tableData = generateDummyTableData(8);
const onNumberRangeChange = (_: [number, number]) => {};

const FileUploaderDemo = () => (
    <Uploader name="file" accept=".csv" uploadURL={dummyUploadURL} onUploadFailure={dummyUploadCallback} onUploadSuccess={dummyUploadCallback} style={{width: 300}}>
        <span>Click or Drag .csv file to here.</span>
    </Uploader>
);

const LocalImporterDemo = () => <LocalImporter type="txt" style={{width: 300, borderRadius: 65}} onImport={dummyImportCallback} />;

const ImageUploaderDemo = () => {
    const [value, setValue] = React.useState<ImageUploadResponse | null>(null);
    return <ImageUploader imageURL={value?.imageURL || null} onChange={setValue} uploadURL={dummyUploadURL} onUploadFailure={dummyUploadCallback} onUploadSuccess={dummyUploadCallback} removable />;
};

const MultipleSelectorDemo = (props: {disabled?: "button" | "table"}) => {
    const [data, setData] = React.useState<MockTableData[]>([]);
    const buttonText = props.disabled ? `Disabled (${props.disabled})` : "Click Me";
    return (
        <MultipleSelector
            tableColumns={dummyTableColumns}
            onChange={setData}
            value={data}
            rowKeyExtractor={_ => _.id.toString()}
            dataSource={tableData}
            renderSelectedItems={items => items.map(_ => _.name)}
            showSelectAll
            buttonText={buttonText}
            disabled={props.disabled}
        />
    );
};

const MultipleSelectorDemoWithMaxSelect = () => {
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
        components: [<MultipleSelectorDemo />, "-", <MultipleSelectorDemo disabled="table" />, "-", <MultipleSelectorDemo disabled="button" />, "-", <MultipleSelectorDemoWithMaxSelect />],
    },
];

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
