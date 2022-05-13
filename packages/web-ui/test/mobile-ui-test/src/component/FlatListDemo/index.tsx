import React from "react";
import {VirtualFlatList} from "@pinnacle0/web-ui/core/FlatList/VirtualFlatList";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {FlatList} from "@pinnacle0/web-ui/core/FlatList";
import {fetchData} from "./fetch";
import type {VirtualFlatListItemProps} from "@pinnacle0/web-ui/core/FlatList/VirtualFlatList/type";
import "./index.less";
import type {FlatListItemProps} from "@pinnacle0/web-ui/core/FlatList/type";

const NormalItem: React.FC<FlatListItemProps<string>> = React.memo(props => {
    const {data, index} = props;
    const [expand, setExpand] = React.useState(false);

    return (
        <div className={`item ${index} ${expand ? "expand" : ""}`}>
            <h4>
                {data}
                <div>index: {index}</div>
            </h4>
            <button onClick={() => setExpand(_ => !_)}>toggle</button>
            {expand && (
                <div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                </div>
            )}
        </div>
    );
});

const Item: React.FC<VirtualFlatListItemProps<string>> = React.memo(props => {
    const {data, index, measure} = props;
    const [expand, setExpand] = React.useState(false);
    const [value, setValue] = React.useState("");
    const ref = React.useRef<HTMLDivElement>(null);
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    React.useEffect(() => {
        if (ref.current) {
            measureRef.current(ref.current);
        }
    }, [expand]);

    return (
        <div ref={ref} className={`item ${index} ${expand ? "expand" : ""}`}>
            <h4>
                {data}
                <div>index: {index}</div>
            </h4>
            <Input value={value} onChange={setValue} />
            <button onClick={() => setExpand(_ => !_)}>toggle</button>
            {expand && (
                <div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                    <div>item 1</div>
                </div>
            )}
        </div>
    );
});

export const FlatListDemo = () => {
    const [data, setData] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    const refreshData = async () => {
        setLoading(true);
        const data = await fetchData();
        setData(data);
        setLoading(false);
    };

    const loadMoreData = async () => {
        setLoading(true);
        const data = await fetchData();
        setData(_ => [..._, ...data]);
        setLoading(false);
    };

    React.useEffect(() => {
        refreshData();
    }, []);

    return (
        <div id="flat-list-demo">
            {/* <FlatList
                loading={loading}
                data={data}
                renderItem={NormalItem}
                pullDownRefreshMessage="Release to refresh"
                onPullDownRefresh={refreshData}
                onPullUpLoading={data.length < 100 ? loadMoreData : undefined}
            /> */}
            <VirtualFlatList
                loading={loading}
                data={data}
                renderItem={Item}
                pullDownRefreshMessage="Release to refresh"
                onPullDownRefresh={refreshData}
                onPullUpLoading={data.length < 100 ? loadMoreData : undefined}
                gap={{left: 10, right: 10, bottom: 10, top: 10}}
            />
            <button onClick={() => refreshData()}>update data</button>
        </div>
    );
};
