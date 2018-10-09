/**
 * @module Non-exported
 */

import { ErrorHandlerResult, implementsOnError } from '../index';

/**
 * @hidden
 */
export class ErrorHandler {

    private readonly errorHandlers: Array<ErrorHandlerFunction>;

    private constructor(errorHandlers: Array<ErrorHandlerFunction> = []) {
        this.errorHandlers = errorHandlers;
    }

    static empty() {
        return new ErrorHandler();
    }

    registerErrorHandlerFromObject(onError: any): ErrorHandler {
        if (implementsOnError(onError)) {
            this.errorHandlers.push(<ErrorHandlerFunction> {
                function: onError.onError,
                context: onError
            });
        }
        return this;
    }

    handle(error: any): ErrorHandlerResult {
        return this.errorHandlers.reduce<ErrorHandlerResult>((result, current) => {
            if (!result) return <ErrorHandlerResult> current.function.apply(current.context, [error])
            return result;
        }, undefined as ErrorHandlerResult);
    }

    combine(errorHandler: ErrorHandler): ErrorHandler {
        return new ErrorHandler(this.errorHandlers.concat(errorHandler.getErrorHandlerCopy()));
    }

    getErrorHandlerCopy() {
        return this.errorHandlers.slice(0);
    }

    hasHandlers(): boolean {
        return !!this.errorHandlers.length
    }

}

/**
 * @hidden
 */
export interface ErrorHandlerFunction {
    function: (error?: any) => void | ErrorHandlerResult;
    context: Object;
}
