/**
 * @module Types
 */
import { Request, Response } from '../index';

export type HandlerFn = (request: Request, response: Response, next?: Function) => void;

export type ContextHandlerFn = { functionContextInstance: Object, fn: Function };

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
