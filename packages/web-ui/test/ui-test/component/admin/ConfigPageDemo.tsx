import React from "react";
import {AdminPage} from "@pinnacle0/web-ui/admin/AdminPage";
import {Descriptions} from "@pinnacle0/web-ui/core/Descriptions";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {WithExplanation} from "@pinnacle0/web-ui/core/WithExplanation";
import {dummyEmptyCallback} from "../../util/dummyCallback";

export const ConfigPageDemo = () => {
    const [config, setConfig] = React.useState("");
    return (
        <AdminPage>
            <Descriptions>
                <Descriptions.Item label="Test config">
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="Test config">
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
                <Descriptions.Item label="Test config">
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
            </Descriptions>
            <Descriptions>
                <Descriptions.Item label="Test config">
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
                <Descriptions.Item label="Test config">
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
                <Descriptions.Item label={<WithExplanation explanation="Explanation">Test config</WithExplanation>}>
                    <Input value={config} onChange={setConfig} />
                </Descriptions.Item>
            </Descriptions>
            <AdminPage.SaveBar onSave={dummyEmptyCallback} onReset={dummyEmptyCallback} leftNode={<b>Some Left Text For Extra Info</b>} />
        </AdminPage>
    );
};
