import React from "react";
import {RichEditor} from "@pinnacle0/web-ui/admin/RichEditor";
import {dummyUploadCallback, dummyUploadURL} from "../../util/dummyUpload";

export const RichEditorDemo = () => {
    const initialValue = `<p>Initial Line 😂</p>`;
    return <RichEditor value={initialValue} onChange={() => {}} uploadURL={dummyUploadURL} onUploadSuccess={dummyUploadCallback} onUploadFailure={dummyUploadCallback} />;
};
