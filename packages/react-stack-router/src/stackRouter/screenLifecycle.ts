type Callback = () => void;

export type ScreenHook = "willEnter" | "didEnter" | "willExit" | "didExit";

export class ScreenLifecycle {
    private callbacks: Record<ScreenHook, Set<Callback>> = {
        willEnter: new Set(),
        didEnter: new Set(),
        willExit: new Set(),
        didExit: new Set(),
    };

    attach(type: ScreenHook, callback: Callback): () => void {
        this.callbacks[type].add(callback);
        return () => {
            this.callbacks[type].delete(callback);
        };
    }

    trigger(type: ScreenHook) {
        this.callbacks[type].forEach(_ => _());
    }
}
