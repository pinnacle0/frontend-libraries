import React from "react";
import {CellMeasurerCache} from "react-virtualized";
import {FlatList} from "@pinnacle0/web-ui/core/FlatList";
import type {FlatListItemProps} from "@pinnacle0/web-ui/core/FlatList/type";

const cache = new CellMeasurerCache({
    defaultHeight: 500,
});

const randomLength = () => Math.floor(Math.random() * (50 - 5) + 5);

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

export const Main = () => {
    const [data, setData] = React.useState<string[]>([]);

    const updateData = () => {
        setData(new Array(20).fill("a").map(() => makeid(randomLength())));
    };

    return (
        <div>
            <FlatList data={data} itemRenderer={Item} />
            <button onClick={() => updateData()}>update data</button>
        </div>
    );
};
