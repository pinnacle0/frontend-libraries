import React from "react";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {ModalUtil} from "@pinnacle0/web-ui/util/ModalUtil";
import type {Props as ModalProps} from "@pinnacle0/web-ui/core/Modal";
import {Modal} from "@pinnacle0/web-ui/core/Modal";
import {PromptUtil} from "@pinnacle0/web-ui/util/PromptUtil";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {DemoHelper} from "../../DemoHelper";

const DeclarativeModal = ({buttonClassName, title, ...modalProps}: Omit<ModalProps, "visible" | "onCancel" | "width" | "children"> & {buttonClassName?: string}) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <div>
            <Button onClick={() => setVisible(true)} className={buttonClassName}>
                {title}
            </Button>
            <Modal title={`Modal: ${title}`} visible={visible} onCancel={() => setVisible(false)} width={400} {...modalProps}>
                Test
            </Modal>
        </div>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Declarative Modal",
        components: [
            <DeclarativeModal title="Default" buttonClassName="modal-demo-declarative-modal-default" />,
            <DeclarativeModal title="With Loading" loading />,
            <DeclarativeModal title="Extra Title" />,
            <DeclarativeModal title="Un-closable & No Padding" closable={false} addInnerPadding={false} />,
        ],
    },
    {
        title: "Sync Modal Utils",
        showPropsHint: false,
        components: [
            <Button onClick={() => ModalUtil.createSync({body: "A simple string"})} className="modal-demo-sync-modal-default">
                Default
            </Button>,
            <Button onClick={() => ModalUtil.createSync({body: "A simple string", title: "My title", subTitle: "Subtitle", okText: "OKAY"})}>Custom Text</Button>,
            <Button onClick={() => ModalUtil.createSync({body: "A simple string", cancelText: "Cancel", onOk: () => alert("OK"), onCancel: byClose => alert(`Closed (${byClose})`)})}>
                OK/Cancel Event
            </Button>,
            <Button onClick={() => ModalUtil.createSync({body: ["String 1", "String 2", <b>Bold</b>]})}>Multiline Body</Button>,
            "-",
            <Button onClick={() => ModalUtil.createSync({body: "A simple string", destroyTimeoutSecond: 3})}>Auto Close 3s</Button>,
            <Button onClick={() => ModalUtil.createSync({body: "A simple string", hideButtons: true})}>No Button</Button>,
            <Button onClick={() => ModalUtil.createSync({body: "A simple string", closable: false})}>No Close</Button>,
            "-",
            <Button onClick={() => ModalUtil.createAsync({body: ["A simple string", "[OK] will alert true", "[Close] will alert false"], title: "My title"}).then(alert)}>Create Async</Button>,
            <Button onClick={() => ModalUtil.confirm("Are you sure?").then(alert)}>Confirm</Button>,
            "-",
            <Button onClick={() => ModalUtil.createSync({body: "body", footerExtra: "This is a footer"})}>Sync With Footer string</Button>,
            <Button onClick={() => ModalUtil.createSync({body: "body", footerExtra: <Button>Footer Button</Button>})}>Sync With Footer component</Button>,
        ],
    },
    {
        title: "Prompt Util",
        components: [
            <Button
                onClick={() =>
                    PromptUtil.createAsync({
                        title: "Prompt",
                        body:
                            "This is Markdown style syntax\nIt supports __bold__ and `highlight` text\n__Whole line in bold__\n`Whole line in highlight`\nOr __bold text__ and `highlight text` mixed",
                    })
                }
            >
                Prompt
            </Button>,
        ],
    },
];

export const ModalDemo = () => <DemoHelper groups={groups} />;
