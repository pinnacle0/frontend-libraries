export class IDGenerator {
    private initialValue = new Date().getTime();

    /**
     * Generate a unique ID within application scope
     */
    next(): string {
        return (this.initialValue++).toString(16);
    }
}
