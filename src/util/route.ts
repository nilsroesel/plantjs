/**
 * @module Non-exported
 */
import { ErrorHandlerResult, Middleware, Request, Response } from '../index';
import { ErrorHandler, MiddlewareIterator } from '../internal.index';

/**
 * @hidden
 */
export class Route {
    readonly functionChain: Middleware;
    readonly params: Object;
    readonly errorHandler: ErrorHandler;

    constructor(functionChain: Middleware, params: Object, errorHandler: ErrorHandler = ErrorHandler.empty()) {
        this.functionChain = functionChain;
        this.params = params;
        this.errorHandler = errorHandler;
    }

    call(request: Request, response: Response): void {
        if (this.errorHandler.hasHandlers()) {
            try {
                MiddlewareIterator.exec(this.functionChain, request, response);
            } catch (error) {
                const errorPayload: Array<ErrorHandlerResult> = this.errorHandler.handle(error);
                const status: number = errorPayload
                    .map(val => val.status)
                    .reduce((prev, curr) => curr || prev || 500) || 500;
                if (!response.finished()) response.status(status).respond(errorPayload);
            }
        } else {
            MiddlewareIterator.exec(this.functionChain, request, response);
        }
    }
}
