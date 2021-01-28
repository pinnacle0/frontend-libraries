import React from "react";
import type {Reducer} from "react";

interface State<Response> {
    data: Response | null;
    loading: boolean;
}

type Action<Response> = {type: "start"} | {type: "load"; data: Response};

function reducer<Response>(state: State<Response>, action: Action<Response>): State<Response> {
    switch (action.type) {
        case "start":
            return {...state, loading: true};
        case "load":
            return {...state, loading: false, data: action.data};
    }
}

/**
 * TODO: Compare DX with useAPI
 * Use API hook with similar style to other react hooks like useMemo
 * const {response, loading, refresh} = useThunk(() => {new Promise(resolve => resolve("arrow function changes everytime")}, [deps]);
 * @param thunk
 * @param deps
 */
export function useThunk<Response>(thunk: () => Promise<Response>, deps: any[]): {response: Response | null; loading: boolean; refresh: () => void} {
    const [{loading, data}, dispatch] = React.useReducer(reducer as Reducer<State<Response>, Action<Response>>, {data: null, loading: false});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only recall on deps change
    const callback = React.useCallback(thunk, deps);

    const fetchData = React.useCallback((): void => {
        dispatch({type: "start"});
        callback().then(data => dispatch({type: "load", data}));
    }, [callback, dispatch]);

    React.useEffect(() => {
        dispatch({type: "start"});
        callback().then(data => dispatch({type: "load", data}));
    }, [callback, dispatch]);

    return {loading, response: data, refresh: fetchData};
}
