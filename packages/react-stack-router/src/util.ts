export class IDGenerator {
    private id = Date.now();
    next(): number {
        return ++this.id;
    }
}
