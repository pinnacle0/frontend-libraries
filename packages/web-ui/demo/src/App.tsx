import React from "react";
import {FlatList} from "@pinnacle0/web-ui/core/FlatList";
import {Profile} from "./Profile";
import type {User} from "./Profile";
import {Reload} from "./Reload";

const genAvatar = () => `https://i.pravatar.cc/300?u=${Math.random()}`;
const fakeLongFetch = () => new Promise(resolve => setTimeout(resolve, 500));
const createUsers = (): User[] => {
    return [
        {
            name: "John Doe",
            phone: "123-456-7890",
            avatar: genAvatar(),
            progress: 55,
            status: "active",
        },
        {
            name: "Jane Smith",
            phone: "123-456-7891",
            avatar: genAvatar(),
            progress: 75,
            status: "active",
        },
        {
            name: "Peter",
            phone: "+852 56441233",
            avatar: genAvatar(),
            progress: 60,
            status: "active",
        },
        {
            name: "Mary",
            phone: "+852 21333333",
            avatar: genAvatar(),
            progress: 70,
            status: "offline",
        },
        {
            name: "John Doe",
            phone: "123-456-7890",
            avatar: genAvatar(),
            progress: 55,
            status: "active",
        },
        {
            name: "Jane Smith",
            phone: "123-456-7891",
            avatar: genAvatar(),
            progress: 75,
            status: "active",
        },
        {
            name: "Peter",
            phone: "+852 56441233",
            avatar: genAvatar(),
            progress: 60,
            status: "active",
        },
        {
            name: "Mary",
            phone: "+852 21333333",
            avatar: genAvatar(),
            progress: 70,
            status: "offline",
        },
    ];
};

export function App() {
    const [data, setData] = React.useState<User[]>(createUsers());
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await fakeLongFetch();
        setData(createUsers());
        setRefreshing(false);
    };

    const fetchMore = async () => {
        setLoading(true);
        await fakeLongFetch();
        setData(_ => [..._, ...createUsers()]);
        setLoading(false);
    };

    return (
        <div className="app">
            <div className="header">Contact</div>
            <FlatList
                data={data}
                rowKey="index"
                renderItem={Profile}
                refreshing={refreshing}
                onPullDownRefresh={refresh}
                loading={loading}
                onPullUpLoading={data.length < 40 ? fetchMore : undefined}
                gap={[10, 15]}
            />
            <button onClick={refresh} className="add-btn">
                <Reload />
            </button>
        </div>
    );
}
