/**
 * @module Types
 */
import { Request, Response } from '../index';
import { IncomingMessage, ServerResponse } from 'http';

export type HandlerFn = (request?: Request, response?: Response, next?: Function) => void;

/**
 * @hidden
 */
export type RequestListenerFn = (request: IncomingMessage, response: ServerResponse) => void;

export interface ContextHandlerFn {
    functionContextInstance: Object;
    fn: Function
}

/**
 * @hidden
 */
export type GenericClassDecorator<T> = (target: T) => void;

export type MiddlewareFunction = HandlerFn | ContextHandlerFn;

export type Middleware = Array<MiddlewareFunction>;

/**
 * @hidden
 */
export interface Instantiable<T> {new(...args: any[]): T;}

export interface ErrorMessage {
    status: number | string;
    message: string;
}
