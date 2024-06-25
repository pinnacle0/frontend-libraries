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
interface ContainerProps {
    children: React.ReactNode;
    width: number;
    height: number;
    horizontal?: boolean;
}

const Container = ({width, height, horizontal = false, children}: ContainerProps) => {
    return <div style={{display: "flex", width, height, flexFlow: horizontal ? "row" : "column"}}>{children}</div>;
};

const Profile = ({profile}: {profile: Profile}) => (
    <React.Fragment>
        <div style={{padding: 20}}>
            <h4>name: {profile.name}</h4>
            <p>age: {profile.age}</p>
            <p>address: {profile.address}</p>
        </div>
    </React.Fragment>
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
        <Container width={500} height={400}>
            <VirtualList data={largeData} renderItem={({index}) => <div style={{height: 100, width: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>Row {index}</div>} />
        </Container>
    );
};

const FixedWidthList = () => {
    return (
        <Container width={700} height={150} horizontal>
            <VirtualList direction="horizontal" data={largeData} renderItem={({index}) => <div style={{height: "100%", width: 200, background: index % 2 ? "brown" : "#c2c2c2"}}>Row {index}</div>} />
        </Container>
    );
};

const rowHeights = new Array(10000).fill(true).map(() => 120 + Math.round(Math.random() * 100));

const DynamicHeightList = () => {
    return (
        <Container width={500} height={400}>
            <VirtualList
                data={largeData}
                renderItem={({data, index}) => (
                    <div style={{height: rowHeights[index], background: index % 2 ? "brown" : "#c2c2c2"}}>
                        <Profile profile={data} />
                    </div>
                )}
            />
        </Container>
    );
};

const DynamicHeightItemWithMarginList = () => {
    return (
        <Container width={500} height={400}>
            <VirtualList
                data={largeData}
                renderItem={({data, index}) => (
                    <div style={{height: rowHeights[index], background: index % 2 ? "brown" : "#c2c2c2", margin: 20}}>
                        <Profile profile={data} />
                    </div>
                )}
            />
        </Container>
    );
};

const DynamicWidthList = () => {
    return (
        <Container width={700} height={150}>
            <VirtualList
                direction="horizontal"
                data={largeData}
                renderItem={({data, index}) => (
                    <div style={{width: 200 + rowHeights[index], height: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>
                        <Profile profile={data} />
                    </div>
                )}
            />
        </Container>
    );
};

enum Size {
    Small = 200,
    Medium = 400,
    Large = 800,
}

const ResizableList = () => {
    const [width, setWidth] = React.useState<Size>(Size.Small);
    const [height, setHeight] = React.useState<Size>(Size.Small);
    return (
        <div>
            <div style={{marginBottom: 20}}>
                Width: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={width} onChange={setWidth} />
            </div>
            <div style={{marginBottom: 20}}>
                Height: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={height} onChange={setHeight} />
            </div>
            <Container width={width} height={height}>
                <VirtualList
                    data={largeData}
                    renderItem={({data, index}) => (
                        <div style={{background: index % 2 ? "brown" : "#c2c2c2"}}>
                            <Profile profile={data} />
                        </div>
                    )}
                />
            </Container>
        </div>
    );
};

const DataMutationList = () => {
    const [width, setWidth] = React.useState<Size>(Size.Medium);
    const [height, setHeight] = React.useState<Size>(Size.Large);
    const [data, setData] = React.useState<Profile[]>(generateProfile(2));

    return (
        <div>
            <div style={{marginBottom: 20}}>
                Width: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={width} onChange={setWidth} />
            </div>
            <div style={{marginBottom: 20}}>
                Height: <EnumRadio useButtonMode list={[200, 400, 800] as Size[]} value={height} onChange={setHeight} />
            </div>
            <Space style={{marginBottom: 20}}>
                <Button onClick={() => setData(_ => [..._, ...generateProfile(1)])}>+</Button>
                <Button color="wire-frame" onClick={() => setData(_ => _.slice(0, -1))}>
                    -
                </Button>
            </Space>
            <Container width={width} height={height}>
                <VirtualList
                    initialRect={{width, height}}
                    overscan={1}
                    data={data}
                    renderItem={({data, index}) => (
                        <div style={{width: "100%", background: index % 2 ? "brown" : "#c2c2c2"}}>
                            <Profile profile={data} />
                        </div>
                    )}
                />
            </Container>
        </div>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Fixed height",
        showPropsHint: false,
        components: [<FixedHeightList />],
    },
    {
        title: "Fixed width",
        showPropsHint: false,
        components: [<FixedWidthList />],
    },
    {
        title: "Dynamic height",
        showPropsHint: false,
        components: [<DynamicHeightList />],
    },
    {
        title: "Dynamic width",
        showPropsHint: false,
        components: [<DynamicWidthList />],
    },
    {
        title: "Dynamic height item with margin",
        showPropsHint: false,
        components: [<DynamicHeightItemWithMarginList />],
    },
    {
        title: "Resizable List",
        showPropsHint: false,
        components: [<ResizableList />],
    },
    {
        title: "List with Data Mutation",
        showPropsHint: false,
        components: [<DataMutationList />],
    },
];

export const VirtualListDemo = () => <DemoHelper groups={groups} />;
