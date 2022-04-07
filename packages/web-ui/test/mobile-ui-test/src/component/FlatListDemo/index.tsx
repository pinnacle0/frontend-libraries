import React from "react";
import {FlatList} from "@pinnacle0/web-ui/core/FlatList";
import type {FlatListItemProps} from "@pinnacle0/web-ui/core/FlatList/type";
import "./index.less";
import {fetchData} from "./fetch";

const Item: React.FC<FlatListItemProps<string>> = React.memo(props => {
    const {data, index, measure} = props;
    const [expand, setExpand] = React.useState(false);
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    React.useEffect(() => {
        measureRef.current();
    }, [expand]);

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
            <FlatList
                className="list"
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
