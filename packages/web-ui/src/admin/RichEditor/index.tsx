import React from "react";
import type {ControlType, EditorState, ImageControlType, MediaType} from "braft-editor";
import BraftEditor from "braft-editor";
import {LocaleUtil} from "../../util/LocaleUtil";
import type {ControlledFormValue} from "../../internal/type";
import type {UploaderProps, UploadLogInfo} from "../../util/UploadUtil/type";
import "braft-editor/dist/index.css";
import "./index.less";
import {UploadUtil} from "../../util/UploadUtil";

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
export interface Props<SuccessResponseType, ErrorResponseType> extends ControlledFormValue<string>, UploaderProps<SuccessResponseType, ErrorResponseType> {
    imageURLParser: (response: SuccessResponseType) => string;
}

interface State {
    editorState: EditorState;
}

export class RichEditor<SuccessResponseType, ErrorResponseType> extends React.PureComponent<Props<SuccessResponseType, ErrorResponseType>, State> {
    static displayName = "RichEditor";

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
            const {formField, uploadURL, imageURLParser, onUploadFailure, onUploadSuccess} = this.props;
            const {file, success, progress} = params;

            UploadUtil.createRequest({
                uploadURL,
                file,
                formField,
                onSuccess: (logEntry, response) => {
                    const imageURL = imageURLParser(response);
                    success({
                        url: imageURL,
                        meta: {
                            id: imageURL,
                            title: "",
                            alt: "image",
                            // Below are for video settings, not available here
                            loop: true,
                            autoPlay: true,
                            controls: true,
                            poster: "",
                        },
                    });
                    onUploadSuccess?.(logEntry, response);
                },
                onError: onUploadFailure,
                onProgress: progress,
            });
        },
    };

    constructor(props: Props<SuccessResponseType, ErrorResponseType>) {
        super(props);
        this.state = {editorState: BraftEditor.createEditorState(this.props.value)};
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
