// spell-checker:words katex, suneditor

import katex from "katex";
import React from "react";
import type {SunEditorReactProps} from "suneditor-react";
import SunEditorReactComponent from "suneditor-react";
import "suneditor/src/assets/css/suneditor-contents.css";
import "suneditor/src/assets/css/suneditor.css";

const setOptions: NonNullable<Props["setOptions"]> = {
    katex,
    buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock", "fontColor"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        "/", // line break
        ["outdent", "indent", "align", "horizontalRule", "list", "lineHeight"],
        ["table", "imageGallery"],
        "/", // line break
        ["save", "preview", "showBlocks"],
    ],
    colorList: ["#000", "Red", "Orange", "DeepPink", "Gold"],
    fontSize: [8, 10, 12, 16, 20, 24, 30, 36],
    height: "400",
    callBackSave(contents) {
        console.info(contents);
    },
};

const setContents: string = `<p><span style="font-size: 30px;">Test</span></p><p style="text-align: center;"><span style="font-size: 16px;"><span style="font-family: Impact;">Such</span> </span><span style="font-size: 20px; font-family: &quot;Comic Sans MS&quot;; color: deeppink;">Wow</span><span style="font-size: 16px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="font-size: 30px;">🐶</span></p><p style="text-align: center;"><span style="font-size: 16px;"><span style="font-family: Impact; font-size: 20px;">Very</span> <span style="font-family: &quot;Comic Sans MS&quot;; font-size: 24px; color: red;">Editor</span></span><span style="font-family: &quot;Comic Sans MS&quot;; color: red; font-size: 12px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="font-size: 16px;"><span style="font-family: &quot;Comic Sans MS&quot;; color: orange;">Much</span></span><span style="font-size: 12px;">&nbsp;</span><span style="color: gold; font-size: 20px; font-family: &quot;Comic Sans MS&quot;;">Good</span></p>`;

export interface Props extends SunEditorReactProps {}

// TODO/Lok: Test if this rich text editor can be used
export class SunEditor extends React.PureComponent<Props> {
    static displayName = "SunEditor";

    render() {
        return <SunEditorReactComponent setOptions={setOptions} setContents={setContents} lang="zh_cn" />;
    }
}
