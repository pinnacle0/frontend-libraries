import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {VirtualList} from "@pinnacle0/web-ui/core/VirtualList";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {Space} from "@pinnacle0/web-ui/core/Space";

interface Profile {
    name: string;
    age: number;
    address: string;
}

const Profile = ({profile}: {profile: Profile}) => (
    <ul>
        <li>name: {profile.name}</li>
        <li>age: {profile.age}</li>
        <li>address: {profile.address}</li>
    </ul>
);

const generateProfile = (size: number): Profile[] => {
    return Array.from({length: size}, () => ({
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    }));
};

const largeData = generateProfile(10000);

const FixedHeightList = () => {
    return (
        <div style={{width: 500, height: 400}}>
            <VirtualList data={largeData} renderData={({index}) => <div style={{height: 100, width: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>Row {index}</div>} />
        </div>
    );
};

const FixedWidthList = () => {
    return (
        <div style={{width: 700, height: 150}}>
            <VirtualList direction="horizontal" data={largeData} renderData={({index}) => <div style={{height: "100%", width: 200, background: index % 2 ? "brown" : "#c2c2c2"}}>Row {index}</div>} />
        </div>
    );
};

const rowHeights = new Array(10000).fill(true).map(() => 60 + Math.round(Math.random() * 100));

const DynamicHeightList = () => {
    return (
        <div style={{width: 500, height: 400}}>
            <VirtualList
                data={largeData}
                renderData={({data, index}) => (
                    <div style={{height: rowHeights[index], background: index % 2 ? "brown" : "#c2c2c2"}}>
                        <Profile profile={data} />
                    </div>
                )}
            />
        </div>
    );
};

const DynamicWidthList = () => {
    return (
        <div style={{width: 700, height: 150}}>
            <VirtualList
                direction="horizontal"
                data={largeData}
                renderData={({data, index}) => (
                    <div style={{width: 200 + rowHeights[index], height: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>
                        <Profile profile={data} />
                    </div>
                )}
            />
        </div>
    );
};

enum Size {
    Small = 200,
    Medium = 400,
    Large = 800,
}

const ResizableVirtualList = () => {
    const [width, setWidth] = React.useState<Size>(Size.Small);
    const [height, setHeight] = React.useState<Size>(Size.Small);
    return (
        <div>
            <p style={{marginBottom: 20}}>
                Width: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={width} onChange={setWidth} />
            </p>
            <p style={{marginBottom: 20}}>
                Height: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={height} onChange={setHeight} />
            </p>
            <div style={{width, height}}>
                <VirtualList
                    data={largeData}
                    renderData={({data, index, measure}) => (
                        <div style={{background: index % 2 ? "brown" : "#c2c2c2"}} ref={measure}>
                            <Profile profile={data} />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

const DataMutation = () => {
    const [width, setWidth] = React.useState<Size>(Size.Medium);
    const [height, setHeight] = React.useState<Size>(Size.Large);
    const [data, setData] = React.useState<Profile[]>(generateProfile(2));

    return (
        <div>
            <p style={{marginBottom: 20}}>
                Width: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={width} onChange={setWidth} />
            </p>
            <p style={{marginBottom: 20}}>
                Height: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={height} onChange={setHeight} />
            </p>
            <Space style={{marginBottom: 20}}>
                <Button onClick={() => setData(_ => [..._, ...generateProfile(1)])}>+</Button>
                <Button color="wire-frame" onClick={() => setData(_ => _.slice(0, -1))}>
                    -
                </Button>
            </Space>
            <div style={{width, height}}>
                <VirtualList
                    initialRect={{width, height}}
                    overscan={1}
                    data={data}
                    renderData={({data, index}) => (
                        <div style={{width: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>
                            <Profile profile={data} />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "VirtualList with fixed height",
        showPropsHint: false,
        components: [<FixedHeightList />],
    },
    {
        title: "VirtualList with fixed width",
        showPropsHint: false,
        components: [<FixedWidthList />],
    },
    {
        title: "VirtualList with dynamic height",
        showPropsHint: false,
        components: [<DynamicHeightList />],
    },
    {
        title: "VirtualList with dynamic width",
        showPropsHint: false,
        components: [<DynamicWidthList />],
    },
    {
        title: "Resizable VirtualList",
        showPropsHint: false,
        components: [<ResizableVirtualList />],
    },
    {
        title: "VirtualList with Data Mutation",
        showPropsHint: false,
        components: [<DataMutation />],
    },
];

export const VirtualListDemo = () => <DemoHelper groups={groups} />;
