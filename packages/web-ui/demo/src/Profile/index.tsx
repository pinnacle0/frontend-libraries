import React from "react";
import type {FlatListItemProps} from "@pinnacle0/web-ui/src/core/FlatList";
import "./index.less";

export interface User {
    name: string;
    phone: string;
    avatar: string;
    progress: number;
    status: "active" | "offline";
}

export const Profile = ({data}: FlatListItemProps<User>) => {
    const {name, phone, avatar} = data;
    return (
        <div className="profile">
            <img src={avatar} alt="avatar" />
            <div className="right">
                <div className="title">{name}</div>
                <div className="sub">{phone}</div>
            </div>
        </div>
    );
};
