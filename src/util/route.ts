export class Route {
    readonly handlerFn: Function;
    readonly params: Object;

    constructor(handlerFn: Function, params: Object) {
        this.handlerFn = handlerFn;
        this.params = params;
    }
}
