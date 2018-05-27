import { Request, Response } from '../index';

export type HandlerFn = (request: Request, response: Response) => void;

export type GenericClassDecorator<T> = (target: T) => void;

export interface Instantiable<T> {new(...args: any[]): T;}
