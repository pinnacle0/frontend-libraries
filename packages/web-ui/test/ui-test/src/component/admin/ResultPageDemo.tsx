import React from "react";
import {AdminPage} from "@pinnacle0/web-ui/admin/AdminPage";

export const ResultPageDemo = () => {
    const [state, setState] = React.useState<"success" | "error">("success");
    const isSuccess = state === "success";
    const switchResult = () => setState(isSuccess ? "error" : "success");
    return (
        <AdminPage>
            <AdminPage.Result type={state} title={isSuccess ? "Success Page" : "Error Page"} subtitle="Subtitle" secondaryButton={{label: "Switch Result", onClick: switchResult}} />
        </AdminPage>
    );
};
