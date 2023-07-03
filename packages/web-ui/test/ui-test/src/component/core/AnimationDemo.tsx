import React from "react";
import {DemoHelper} from "../DemoHelper";
import {AnimatePresence, Animated} from "@pinnacle0/web-ui/core/Animated";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {Space} from "@pinnacle0/web-ui/core/Space";
import {CloseCircleFilled} from "@ant-design/icons";
import {TypedTabs} from "@pinnacle0/web-ui/core/TypedTabs";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import type {TypedTabMap} from "@pinnacle0/web-ui/core/TypedTabs";
import {Checkbox} from "@pinnacle0/web-ui/core/Checkbox";

interface AnimatedListProps {
    list: string[];
    onChange: (list: string[]) => void;
}

const AnimatedList = ({list, onChange}: AnimatedListProps) => {
    const remove = (index: number) => onChange(list.filter((_, i) => i !== index));

    return (
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
    );
};

const AnimatedListOperators = ({list, onChange}: AnimatedListProps) => {
    const [value, setValue] = React.useState("");
    const [index, setIndex] = React.useState<number | null>(null);
    return (
        <Space>
            <Input value={value} onChange={setValue} placeholder="Add new item" />
            <NumberInput allowNull value={index} onChange={setIndex} placeholder="inset at" />
            <Space.Compact>
                <Button
                    type="primary"
                    onClick={() => {
                        if (index === null) {
                            onChange([...list, value]);
                        } else {
                            const newList = [...list];
                            newList.splice(index, 0, value);
                            onChange(newList);
                        }
                        setValue("");
                        setIndex(null);
                    }}
                >
                    Add
                </Button>
                <Button onClick={() => onChange([])}>Clear</Button>
            </Space.Compact>
        </Space>
    );
};

const AnimatedListWithOperators = ({initialList}: {initialList: string[]}) => {
    const [list, setList] = React.useState(initialList);

    return (
        <Space direction="vertical" size={20}>
            <AnimatedList list={list} onChange={setList} />
            <AnimatedListOperators list={list} onChange={setList} />
        </Space>
    );
};

const AnimatedListInTab = () => {
    const [activeKey, setActiveKey] = React.useState<"one" | "two">("one");
    const [destroyInactivePanel, setDestroyInactivePanel] = React.useState(false);

    const tabs: TypedTabMap<"one" | "two"> = {
        one: {
            title: "One",
            content: <AnimatedListWithOperators initialList={["1", "2", "3", "5"]} />,
        },
        two: {
            title: "Two",
            content: <AnimatedListWithOperators initialList={["Mary", "Peter", "Harry"]} />,
        },
    };

    return (
        <Space size={20} direction="vertical">
            <TypedTabs tabs={tabs} type="line" activeKey={activeKey} onChange={setActiveKey} destroyInactiveTabPane={destroyInactivePanel} />
            <Checkbox value={destroyInactivePanel} onChange={setDestroyInactivePanel}>
                Destroy inactive tab Panel
            </Checkbox>
        </Space>
    );
};

const NestedAnimatedList = () => {
    const [list, setList] = React.useState(["1", "2", "3", "5"]);
    return (
        <Space direction="vertical" size={30}>
            <Animated.div
                enter={{
                    frames: [{transform: "rotate(-360deg)"}, {transform: "rotate(0deg)"}],
                    options: {duration: 5000, easing: "linear", iterations: Infinity},
                }}
            >
                <AnimatedList list={list} onChange={setList} />
            </Animated.div>
            <AnimatedListOperators list={list} onChange={setList} />
        </Space>
    );
};

const AnimatedSlicedList = () => {
    const [list, setList] = React.useState<string[]>(["1", "2", "3", "4"]);

    const remove = (index: number) => setList(list => list.filter((_, i) => i !== index));

    return (
        <Space direction="vertical" size={20}>
            <AnimatePresence>
                {list.slice(Math.max(list.length - 5, 0)).map((_, index) => (
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
            <AnimatedListOperators list={list} onChange={setList} />
        </Space>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Animated List",
        components: [<AnimatedListWithOperators initialList={["1", "2", "3", "5"]} />],
    },
    {
        title: "Animated list in Tab",
        components: [<AnimatedListInTab />],
    },
    {
        title: "Animated inside Animated",
        components: [<NestedAnimatedList />],
    },
    {
        title: "Animated Sliced List",
        components: [<AnimatedSlicedList />],
    },
];

export const AnimationDemo = () => <DemoHelper groups={groups} />;
