type Callback = () => void;

export type LifecycleHookHook = "willEnter" | "didEnter" | "willExit" | "didExit";

export const TRIGGER = Symbol("trigger");

export class Lifecycle {
    private callbacks: Record<LifecycleHookHook, Set<Callback>> = {
        willEnter: new Set(),
        didEnter: new Set(),
        willExit: new Set(),
        didExit: new Set(),
    };

    attach(type: LifecycleHookHook, callback: Callback): () => void {
        this.callbacks[type].add(callback);
        return () => {
            this.callbacks[type].delete(callback);
        };
    }

    attachOnce(type: LifecycleHookHook, callback: Callback) {
        const wrapper = () => {
            callback();
            this.callbacks[type].delete(callback);
        };
        this.callbacks[type].add(wrapper.bind(this));
    }

    trigger(type: LifecycleHookHook) {
        this.callbacks[type].forEach(_ => _());
    }
}
