const lifeCycleMethodList = [
    "render",
    "componentDidMount",
    "componentDidUpdate",
    "componentWillUnmount",
    "shouldComponentUpdate",
    "getDerivedStateFromProps",
    "getSnapshotBeforeUpdate",
    // biome-ignore lint: preserve
] as const;

export function isReactComponentLifecyleMethod(methodName: string): boolean {
    return lifeCycleMethodList.includes(methodName as any);
}
