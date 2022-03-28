import React from "react";
import {FlatList} from "@pinnacle0/web-ui/core/FlatList";
import type {FlatListItemProps} from "@pinnacle0/web-ui/core/FlatList/type";
import "./index.less";

const randomLength = () => Math.floor(Math.random() * (150 - 10) + 5);

function makeid(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const Item: React.FC<FlatListItemProps<string>> = props => {
    const {data, index, measure} = props;
    const [expand, setExpand] = React.useState(false);
    const indexRef = React.useRef(index);
    indexRef.current = index;

    React.useLayoutEffect(() => {
        measure();
    });

    return (
        <div className={`item ${index} ${expand ? "expand" : ""}`}>
            <h4>
                {data}, index: {index}
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
};

export const FlatListDemo = () => {
    const [data, setData] = React.useState<string[]>([]);

    const updateData = () => {
        setData(new Array(100).fill("a").map(() => makeid(randomLength())));
    };

    React.useEffect(updateData, []);

    return (
        <div className="main-container">
            <FlatList data={data} renderItem={Item} pullDownMessage="Release to refresh" />
            <button onClick={() => updateData()}>update data</button>
        </div>
    );
};
