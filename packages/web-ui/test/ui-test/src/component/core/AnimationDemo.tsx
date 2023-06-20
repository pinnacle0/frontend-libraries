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
    const [list, setList] = React.useState<string[]>(["1", "2", "3", "4"]);
    const [value, setValue] = React.useState("");

    const remove = (index: number) => setList(list => list.filter((_, i) => i !== index));

    return (
        <Space direction="vertical" size={20}>
            <AnimatePresence>
                {list.map((_, index) => (
                    <animated.div
                        key={_}
                        enter={{
                            frames: [
                                {transform: "translateY(-10px)", opacity: 0},
                                {transform: "translateY(0px)", opacity: 1},
                            ],
                            options: {duration: 300, easing: "ease-out"},
                        }}
                        exit={{
                            frames: [
                                {transform: "translateX(0px)", opacity: 1},
                                {transform: "translateX(20px)", opacity: 0},
                            ],
                            options: {duration: 5000, easing: "ease-out", fill: "forwards"},
                        }}
                    >
                        <Space size={15}>
                            <Button type="ghost" shape="circle" onClick={() => remove(index)} icon={<CloseCircleFilled />} />
                            <span>{_}</span>
                        </Space>
                    </animated.div>
                ))}
            </AnimatePresence>
            <Button type="primary" onClick={() => setList([])}>
                Clear
            </Button>
            <Space>
                <Input value={value} onChange={setValue} placeholder="Add new item" />

                <Button
                    onClick={() => {
                        setList(_ => [..._, value]);
                        setValue("");
                    }}
                >
                    Add
                </Button>
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
