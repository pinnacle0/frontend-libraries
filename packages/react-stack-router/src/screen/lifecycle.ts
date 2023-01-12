type Callback = () => void;

export type Hook = "willEnter" | "didEnter" | "willExit" | "didExit";

export class Lifecycle {
    private callbacks: Record<Hook, Set<Callback>> = {
        willEnter: new Set(),
        didEnter: new Set(),
        willExit: new Set(),
        didExit: new Set(),
    };

    attach(type: Hook, callback: Callback): () => void {
        this.callbacks[type].add(callback);
        return () => {
            this.callbacks[type].delete(callback);
        };
    }

    trigger(type: Hook) {
        this.callbacks[type].forEach(_ => _());
    }
}
