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
                const errorHandlerResult: ErrorHandlerResult = this.errorHandler.handle(error) || {
                    status: 500,
                    payload: error.stack
                };
                if (!response.finished()) response.status(errorHandlerResult.status).respond(errorHandlerResult.payload);
            }
        } else {
            MiddlewareIterator.exec(this.functionChain, request, response);
        }
    }
}
