import React from "react";
import {DemoHelper} from "../DemoHelper";
import {AnimatePresence} from "@pinnacle0/web-ui/core/AnimatePresence";
import {animated} from "@pinnacle0/web-ui/core/AnimatePresence/Animated";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {Space} from "@pinnacle0/web-ui/core/Space";
import {CloseCircleFilled} from "@ant-design/icons";
import type {DemoHelperGroupConfig} from "../DemoHelper";

const AnimatedList = () => {
    const [list, setList] = React.useState<string[]>(["1", "122", "123", "1333"]);
    const [value, setValue] = React.useState("");

    const remove = (index: number) => setList(list => list.filter((_, i) => i !== index));

    return (
        <Space direction="vertical" size={20}>
            <AnimatePresence>
                {list.map((_, index) => (
                    <animated.div key={index}>
                        <Space size={15}>
                            <Button type="ghost" shape="circle" onClick={() => remove(index)} icon={<CloseCircleFilled />} />
                            <span>{_}</span>
                        </Space>
                    </animated.div>
                ))}
            </AnimatePresence>
            <Space>
                <Input value={value} onChange={setValue} placeholder="Add new item" />
                <Space.Compact>
                    <Button
                        onClick={() => {
                            setList(_ => [..._, value]);
                            setValue("");
                        }}
                    >
                        Add
                    </Button>
                    <Button type="primary" onClick={() => setList([])}>
                        Clear All Item
                    </Button>
                </Space.Compact>
            </Space>
        </Space>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "",
        components: [<AnimatedList />],
    },
];

export const AnimationDemo = () => <DemoHelper groups={groups} />;
