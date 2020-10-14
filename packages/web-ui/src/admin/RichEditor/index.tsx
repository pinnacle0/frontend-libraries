import React from "react";
import BraftEditor, {ControlType, EditorState, ImageControlType, MediaType} from "braft-editor";
import {LocaleUtil} from "../../util/LocaleUtil";
import {ControlledFormValue} from "../../internal/type";
import {UploadUtil, UploadProps, UploadLogInfo} from "../../util/UploadUtil";
import "braft-editor/dist/index.css";
import "./index.less";

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
        "separator",
        "list-ul",
        "list-ol",
        "separator",
        "link",
        "media",
        "separator",
        "remove-styles",
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
            const {uploadURL, onUploadFailure, onUploadSuccess} = this.props;
            const httpRequest = new XMLHttpRequest();
            const formData = new FormData();
            const startTime = Date.now();

            // Do not early evaluate before success/failure callback, because we need wait XHR response
            const getLogInfo = (): UploadLogInfo => ({
                file_name: params.file.name,
                file_size: params.file.size.toString(),
                file_type: params.file.type,
                api_response: httpRequest.responseText,
            });

            const onSuccess = () => {
                const response = httpRequest.response;
                try {
                    const {imageKey, imageURL} = UploadUtil.castImageUploadResponse(httpRequest.response);
                    params.success({
                        url: imageURL,
                        meta: {
                            id: imageKey,
                            title: "",
                            alt: "image",
                            // Below are for video settings, not available here
                            loop: true,
                            autoPlay: true,
                            controls: true,
                            poster: "",
                        },
                    });
                    onUploadSuccess(response, {
                        info: getLogInfo(),
                        elapsedTime: Date.now() - startTime,
                    });
                } catch (e) {
                    onUploadFailure(response, {
                        info: getLogInfo(),
                        elapsedTime: Date.now() - startTime,
                        errorCode: "RICH_EDITOR_INVALID_UPLOAD_RESPONSE",
                        errorMessage: e?.message || "[Unknown]",
                    });
                }
            };
            const onFailure = (errorMessage: string) => {
                const response = httpRequest.response;
                onUploadFailure(response, {
                    info: getLogInfo(),
                    elapsedTime: Date.now() - startTime,
                    errorCode: "RICH_EDITOR_UPLOAD_FAILURE",
                    errorMessage,
                });
            };

            httpRequest.upload.addEventListener("progress", event => params.progress((event.loaded / event.total) * 100), false);
            httpRequest.addEventListener("load", onSuccess, false);
            httpRequest.addEventListener("error", () => onFailure("Upload invalid"), false);
            httpRequest.addEventListener("abort", () => onFailure("Upload aborted"), false);
            httpRequest.addEventListener("timeout", () => onFailure("Upload timeout"), false);
            formData.append("image", params.file);
            httpRequest.open("POST", uploadURL, true);
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
