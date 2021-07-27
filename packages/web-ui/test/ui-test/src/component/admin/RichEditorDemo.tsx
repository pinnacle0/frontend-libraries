import React from "react";
import {RichEditor} from "@pinnacle0/web-ui/admin/RichEditor";
import {dummyUploadCallback, dummyUploadImageFormField, dummyUploadImageUploadURL} from "../../dummy/dummyUpload";
import {dummyEmptyCallback} from "../../dummy/dummyCallback";
import type {TestImageUploadResponse, APIErrorResponse} from "../../type";

export const RichEditorDemo = () => {
    const initialValue = `<p>Initial Line 😂</p>`;
    return (
        <RichEditor<TestImageUploadResponse, APIErrorResponse>
            value={initialValue}
            formField={dummyUploadImageFormField}
            imageURLParser={response => response.imageURL}
            onChange={dummyEmptyCallback}
            uploadURL={dummyUploadImageUploadURL}
            onUploadSuccess={dummyUploadCallback}
            onUploadFailure={dummyUploadCallback}
        />
    );
};
