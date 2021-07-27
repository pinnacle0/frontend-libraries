import React from "react";
import {ImageUploader} from "@pinnacle0/web-ui/core/ImageUploader";
import {LocalImporter} from "@pinnacle0/web-ui/core/LocalImporter";
import {dummyUploadImageUploadURL, dummyUploadImageFormField, dummyUploadCallback, dummyImportCallback} from "../../dummy/dummyUpload";
import type {TestImageUploadResponse, APIErrorResponse} from "../../type";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const ImageUploaderDemo = ({removable, width, height}: {removable: boolean; width: number; height: number}) => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
        <div>
            <ImageUploader<TestImageUploadResponse, APIErrorResponse>
                width={width}
                height={height}
                formField={dummyUploadImageFormField}
                imageURL={value}
                onChange={response => setValue(response.imageURL)}
                onRemove={removable ? () => setValue(null) : undefined}
                uploadURL={dummyUploadImageUploadURL}
                onUploadFailure={dummyUploadCallback}
                onUploadSuccess={dummyUploadCallback}
            />
            <br />
            <p>
                Size: {width} x {height}
            </p>
        </div>
    );
};

const LocalImporterDemo = () => <LocalImporter type="txt" style={{width: 500, height: 120}} onImport={dummyImportCallback} />;

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Removable Image Uploader",
        showPropsHint: false,
        components: [<ImageUploaderDemo removable width={500} height={300} />],
    },
    {
        title: "Un-removable Image Uploader",
        showPropsHint: false,
        components: [<ImageUploaderDemo removable={false} width={150} height={100} />],
    },
    {
        title: "Importer (no AJAX call)",
        showPropsHint: false,
        components: [<LocalImporterDemo />],
    },
];

export const UploaderImporterDemo = () => <DemoHelper groups={groups} />;
