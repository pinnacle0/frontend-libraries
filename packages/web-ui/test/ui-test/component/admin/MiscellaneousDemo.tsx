import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {ImageUploader} from "@pinnacle0/web-ui/core/ImageUploader";
import {MultipleSelector} from "@pinnacle0/web-ui/core/MultipleSelector";
import type {MockTableData} from "../../util/dummyTableData";
import {dummyTableColumns, generateDummyTableData} from "../../util/dummyTableData";
import {dummyImportCallback, dummyUploadCallback, dummyUploadURL} from "../../util/dummyUpload";
import {Uploader} from "@pinnacle0/web-ui/core/Uploader";
import {LocalImporter} from "@pinnacle0/web-ui/core/LocalImporter";
import type {ImageUploadResponse} from "@pinnacle0/web-ui/util/UploadUtil";
import {Pagination} from "../../../../src/core/Pagination";
import {MessageUtil} from "../../../../src/util/MessageUtil";

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

const MultipleSelectorDemo = (props: {withPagination?: boolean; disabled?: "button" | "table"}) => {
    const pageSize = 5;
    const [data, setData] = React.useState<MockTableData[]>([]);
    const [page, setPage] = React.useState(1); // Start from 1
    const dataSource = React.useMemo(() => generateDummyTableData(pageSize, (page - 1) * 10 + 1), [page]);

    if (props.withPagination) {
        return (
            <MultipleSelector
                tableColumns={dummyTableColumns}
                onChange={setData}
                value={data}
                rowKeyExtractor={_ => _.id.toString()}
                dataSource={dataSource}
                renderButtonText="Paged Selector"
                renderTags="name"
                renderPopover={table => (
                    <div>
                        {table}
                        <Pagination onChange={setPage} totalCount={50 * pageSize} totalPage={50} pageIndex={page} />
                    </div>
                )}
            />
        );
    } else {
        const buttonText = props.disabled ? `Disabled (${props.disabled})` : "Simple Selector";
        return (
            <MultipleSelector
                tableColumns={dummyTableColumns}
                onChange={setData}
                value={data}
                rowKeyExtractor={_ => _.id.toString()}
                dataSource={dataSource}
                renderButtonText={buttonText}
                disabled={props.disabled}
                renderTags="name"
                onPopoverFirstRender={() => MessageUtil.success("First opened")}
            />
        );
    }
};

const groups: DemoHelperGroupConfig[] = [
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
        components: [<MultipleSelectorDemo />, "-", <MultipleSelectorDemo withPagination />, "-", <MultipleSelectorDemo disabled="table" />, "-", <MultipleSelectorDemo disabled="button" />],
    },
];

export const MiscellaneousDemo = () => <DemoHelper groups={groups} />;
