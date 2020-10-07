import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {AdminPage} from "@pinnacle0/web-ui/admin/AdminPage";
import {AdminAppContext} from "@pinnacle0/web-ui/admin/AdminApp/context";
import {Link} from "@pinnacle0/web-ui/core/Link";

const linkStyle: React.CSSProperties = {marginTop: 10, textDecoration: "underline", color: "blue"};

export const SeparateTabDetailDemo = (props: RouteComponentProps<{id: string}>) => {
    const id = props.match.params.id;

    const [status, setStatus] = React.useState<"loading" | "ok" | "error">("loading");
    const {updateTitle} = React.useContext(AdminAppContext);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (id.length <= 3) {
                updateTitle("Detail - " + id);
                setStatus("ok");
            } else {
                updateTitle("Detail (Error)");
                setStatus("error");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, updateTitle]);

    return (
        <AdminPage>
            {status === "loading" && <h1>Loading ....</h1>}
            {status === "ok" && <h1>ID: {id}</h1>}
            {status === "error" && <h1>Invalid ID</h1>}
            <p style={linkStyle}>
                <Link to="/admin/separate-tab-detail/100">ID: 100 (Valid)</Link>
            </p>
            <p style={linkStyle}>
                <Link to="/admin/separate-tab-detail/200">ID: 200 (Valid)</Link>
            </p>
            <p style={linkStyle}>
                <Link to="/admin/separate-tab-detail/1000">ID: 1000 (Invalid)</Link>
            </p>
        </AdminPage>
    );
};
