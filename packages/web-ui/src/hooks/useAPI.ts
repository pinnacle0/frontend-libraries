import React from "react";
import type {Reducer} from "react";

interface State<Request, Response> {
    request: Request;
    data: Response | null;
    loading: boolean;
}

type Action<Request, Response> = {type: "start"; request: Request} | {type: "load"; data: Response};

function reducer<Request extends any[], Response>(state: State<Request, Response>, action: Action<Request, Response>): State<Request, Response> {
    switch (action.type) {
        case "start":
            return {...state, loading: true, request: action.request};
        case "load":
            return {...state, loading: false, data: action.data};
    }
}

export function useAPI<Request extends any[], Response>(
    api: (...request: Request) => Promise<Response>,
    initialRequest: Request
): {request: Request; response: Response | null; loading: boolean; refresh: (request: Request) => void} {
    const [{loading, data, request}, dispatch] = React.useReducer(reducer as Reducer<State<Request, Response>, Action<Request, Response>>, {request: initialRequest, data: null, loading: false});
    const fetchData = React.useCallback((newRequest: Request): void => dispatch({type: "start", request: newRequest}), []);

    React.useEffect(() => {
        dispatch({type: "start", request});
        api(...request).then(data => dispatch({type: "load", data}));
        // TODO: Review if api change should trigger re-fetch
    }, [request, api, dispatch]);

    return {loading, request, response: data, refresh: fetchData};
}
