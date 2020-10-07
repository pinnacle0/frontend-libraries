import React from "react";

export interface AdminAppContextType {
    updateTitle: (title: string | null) => void;
    registerTitleUpdater: (fn: (title: string | null) => void) => void;
}

export const AdminAppContext = React.createContext<AdminAppContextType>({
    updateTitle: () => {},
    registerTitleUpdater: () => {},
});
