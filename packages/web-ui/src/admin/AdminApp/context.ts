import React from "react";

export interface AdminAppContextType {
    name: string;
    updateTitle: (title: string | null) => void;
    registerTitleUpdater: (fn: (title: string | null) => void) => void;
}

export const AdminAppContext = React.createContext<AdminAppContextType>({
    name: "",
    updateTitle: () => {},
    registerTitleUpdater: () => {},
});
