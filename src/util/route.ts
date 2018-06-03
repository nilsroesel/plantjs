/**
 * @module Non-exported
 */
import { Request, Response, Middleware } from '../index';
import { MiddlewareIterator } from '../internal.index';

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
