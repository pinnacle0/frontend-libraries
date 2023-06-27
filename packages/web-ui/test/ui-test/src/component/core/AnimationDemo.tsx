import React from "react";
import {DemoHelper} from "../DemoHelper";
import {AnimatePresence, Animated} from "@pinnacle0/web-ui/core/Animated";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {Space} from "@pinnacle0/web-ui/core/Space";
import {CloseCircleFilled} from "@ant-design/icons";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";

const AnimatedList = () => {
    const [list, setList] = React.useState<string[]>(["1", "2", "3", "4"]);
    const [value, setValue] = React.useState("");
    const [index, setIndex] = React.useState<number | null>(null);

    const remove = (index: number) => setList(list => list.filter((_, i) => i !== index));

    return (
        <Space direction="vertical" size={20}>
            <AnimatePresence>
                {list.map((_, index) => (
                    <Animated.div
                        key={_}
                        enter={{
                            frames: [
                                {transform: "translateY(-10px)", opacity: 0},
                                {transform: "translateY(0px)", opacity: 1},
                            ],
                            options: {duration: 3000, easing: "ease-out"},
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
                    </Animated.div>
                ))}
            </AnimatePresence>
            <Button type="primary" onClick={() => setList([])}>
                Clear
            </Button>
            <Space>
                <Input value={value} onChange={setValue} placeholder="Add new item" />
                <NumberInput allowNull value={index} onChange={setIndex} placeholder="inset at" />
                <Button
                    onClick={() => {
                        if (index === null) {
                            setList(_ => [..._, value]);
                        } else {
                            const newList = [...list];
                            newList.splice(index, 0, value);
                            setList(newList);
                        }
                        setValue("");
                        setIndex(null);
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
