import React from "react";
import BraftEditor, {ControlType, EditorState, ImageControlType, MediaType} from "braft-editor";
import Table from "braft-extensions/dist/table";
import {LocaleUtil} from "../../util/LocaleUtil";
import {ControlledFormValue, ImageUploadResponse, UploadProps} from "../../internal/type";
import "braft-editor/dist/index.css";
import "braft-extensions/dist/table.css";
import "./index.less";

BraftEditor.use(
    Table({
        withDropdown: true,
    })
);

/**
 * onChange/value is of the HTML content.
 * If the HTML content is only empty rows (e.g: pure <p/>), onChange also emit "".
 *
 * CAVEAT:
 * This component is storing the editor state internally (un-controlled).
 * The props.value only represents the initial value.
 * Because createEditorState must only be created only ONCE, in the constructor.
 * Therefore, we cannot create new editor state every time based on current props.value.
 *
 * Ref: https://www.yuque.com/braft-editor/be/lzwpnr#1bbbb204
 */
export interface Props extends ControlledFormValue<string>, UploadProps {}

interface State {
    editorState: EditorState;
}

export class RichEditor extends React.PureComponent<Props, State> {
    static displayName = "RichEditor";

    private readonly ref: React.RefObject<BraftEditor>;

    // API reference: https://www.yuque.com/braft-editor/be/gz44tn
    private readonly editorControls: ControlType[] = [
        "font-size",
        "text-align",
        "text-color",
        "bold",
        "italic",
        "underline",
        "strike-through",
        "remove-styles",
        "separator",
        "list-ul",
        "list-ol",
        "blockquote",
        "table",
        "separator",
        "link",
        "media",
    ];
    private readonly imageControls: ImageControlType[] = [];
    private readonly mediaConfig: MediaType = {
        pasteImage: false,
        accepts: {
            image: "image/png,image/jpeg,image/gif,image/svg",
            video: false,
            audio: false,
        },
        externals: {
            image: false,
            audio: false,
            video: false,
            embed: false,
        },
        uploadFn: params => {
            const serverURL = "/ajax/upload";
            const httpRequest = new XMLHttpRequest();
            const formData = new FormData();
            const startTime = Date.now();
            const fileInfo: {[key: string]: string} = {
                fileName: params.file.name,
                fileSize: params.file.size.toString(),
                fileType: params.file.type,
            };
            const onSuccess = () => {
                let isSuccess = false;
                const info: {[key: string]: string} = {...fileInfo, serverResponse: httpRequest.responseText};
                try {
                    const response: ImageUploadResponse = JSON.parse(httpRequest.responseText);
                    params.success({
                        url: response.imageURL,
                        meta: {
                            id: response.imageKey,
                            title: "",
                            alt: "image",
                            // Below are for video settings, not available here
                            loop: true,
                            autoPlay: true,
                            controls: true,
                            poster: "",
                        },
                    });
                    isSuccess = true;
                } catch (e) {
                    info["jsonParseError"] = e?.message || "Unknown Error";
                } finally {
                    this.props.onUpload(isSuccess ? "success" : "failure", info, Date.now() - startTime, undefined);
                }
            };
            const onFailure = (errorMessage: string) => {
                const info: {[key: string]: string} = {...fileInfo, errorMessage};
                this.props.onUpload("failure", info, Date.now() - startTime, undefined);
            };
            httpRequest.upload.addEventListener("progress", event => params.progress((event.loaded / event.total) * 100), false);
            httpRequest.addEventListener("load", onSuccess, false);
            httpRequest.addEventListener("error", () => onFailure("Upload invalid"), false);
            httpRequest.addEventListener("abort", () => onFailure("Upload aborted"), false);
            httpRequest.addEventListener("timeout", () => onFailure("Upload timeout"), false);
            formData.append("image", params.file);
            httpRequest.open("POST", serverURL, true);
            httpRequest.send(formData);
        },
    };

    constructor(props: Props) {
        super(props);
        this.state = {editorState: BraftEditor.createEditorState(this.props.value)};
        this.ref = React.createRef();
    }

    onChange = (editorState: EditorState) => {
        this.setState({editorState});
        const {onChange} = this.props;
        const textContent = editorState.toText().trim();
        onChange(textContent === "" ? "" : editorState.toHTML());
    };

    render() {
        const {editorState} = this.state;
        return (
            <BraftEditor
                ref={this.ref}
                language={LocaleUtil.current()}
                controls={this.editorControls}
                media={this.mediaConfig}
                imageControls={this.imageControls}
                value={editorState}
                stripPastedStyles
                onChange={this.onChange}
            />
        );
    }
}
