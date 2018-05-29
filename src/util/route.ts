import { Request, Response, Middleware, MiddlewareIterator } from '../index';

/**
 * @hidden
 */
export class Route {
    readonly functionChain: Middleware;
    readonly params: Object;

    constructor(functionChain: Middleware, params: Object) {
        this.functionChain = functionChain;
        this.params = params;
    }

    call(request: Request, response: Response): void { MiddlewareIterator.exec(this.functionChain, request, response); }
}
