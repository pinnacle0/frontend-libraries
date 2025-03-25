type ArrayValueMap<Value, Key = string> = Map<Key, Value[]>

function get<Value, Key = string>(map: ArrayValueMap<Value, Key>, key: Key): Value[] {
    return map.get(key) ?? []
}

function add<Value, Key = string>(map: ArrayValueMap<Value, Key>, key: Key, value: Value): void {
    map.set(key, [...get(map, key), value])
}

function create<Value, Key = string>(): Map<Key, Value[]> {
    return new Map()
}

export const ArrayValueMapHelper = Object.freeze({
    add,
    get,
    create
})
