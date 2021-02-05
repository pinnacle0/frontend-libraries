import React from "react";

export interface AdminAppContextType {
    baseTitle: string;
    updateTitle: (title: string | null) => void;
    registerTitleUpdater: (fn: (title: string | null) => void) => void;
}

export const AdminAppContext = React.createContext<AdminAppContextType>({
    baseTitle: "",
    updateTitle: () => {},
    registerTitleUpdater: () => {},
});
