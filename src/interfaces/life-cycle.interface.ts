/**
 * @module Lifecycle
 */

/**
 * When the application, a module or a component implements this this interface,
 * the function will be called after the instance was created.
 */
export interface OnInit {
    onInit(): void;
}

/**
 * Type guard for OnInit interface
 */
export function implementsOnInit(arg: any): arg is OnInit {
    return !!(arg || {}).onInit
}

/**
 * When the application, a module or a component implements this this interface,
 * the function will be called on any error in the given scope.
 * Its possible that multiple onError() functions will be called.
 * When you don't return, the next handler will be called. If you return an ErrorHandlerResult
 * this will responded if the connection is still opened.
 */
export interface OnError {
    /**
     * The error handling function for the implementing scope
     * @param error the error that occurred
     */
    onError(error?: any): void | ErrorHandlerResult;
}

/**
 * Type guard for OnError interface
 */
export function implementsOnError(arg: any): arg is OnError {
    return !!(arg || {}).onError
}

export interface ErrorHandlerResult {
    status: number;
    payload?: any;
}