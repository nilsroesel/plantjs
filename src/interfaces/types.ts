/**
 * @module Types
 */
import { Request, Response } from '../index';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * The function type for every endpoint and every middleware
 * The next function will break the current function processing completely and will prosed with the nex middleware function
 */
export type HandlerFn = (request?: Request, response?: Response, next?: Function) => void;

/**
 * @hidden
 */
export type RequestListenerFn = (request: IncomingMessage, response: ServerResponse) => void;

/**
 * Add here the HandlerFn and the object to which the 'this' should be referred to
 */
export interface ContextHandlerFn {
    functionContextInstance: Object;
    fn: HandlerFn
}

/**
 * @hidden
 */
export type GenericClassDecorator<T> = (target: T) => void;

export type MiddlewareFunction = HandlerFn | ContextHandlerFn;

export type Middleware = Array<MiddlewareFunction>;

/**
 * Any class, or expression on which the new-keyword would work
 */
export interface Instantiable<T> {new(...args: any[]): T;}

export interface ErrorMessage {
    status: number | string;
    message: string;
}
