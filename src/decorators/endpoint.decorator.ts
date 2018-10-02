/**
 * @module Decorators
 */
import 'reflect-metadata';
import { EndpointConfig, Middleware, Request, Response } from '../index';
import { EndpointFactory } from '../util/endpoint.factory';

/**
 *
 * Property Decorator Function
 *
 * Creates an endpoint of a function
 * The decorated function need the following index signature otherwise it will throw an error
 * (request: Request, response: Response, next?: Function) (also an index signature fore middlewares)
 * If you pass the next-function and call it, it will get the next function from the route middlewares
 * and abort the current execution
 * @returns
 *
 * @example
 * ```typescript
 *
 *   @Component({route: '/api'})
 *   class Test {
 *
 *      @Endpoint({
 *          route: '/foo'
 *          middleware: [(request: request) => request.params['foo'] = foo; ]
 *      )
 *      foo(request: Request, response: Response) {
 *          response
 *           .status(200)
 *           .json(request.params.foo)
 *           .send();
 *      }
 *   }
 * ```
 * **/
export function Endpoint(config: EndpointConfig) {
    return EndpointFactory.generateEndpointLogic(config);
}

/**
 * @hidden
 */
export interface EndpointHandler {
    functionContextInstance: Object;
    fn: Function;
    route: string;
    middleware?: Middleware;
}

/**
 * @hidden
 */
export function checkHandlerFunctionIndexSignature(target: Object, key: string) {
    const types = Reflect.getMetadata('design:paramtypes', target, key) || [];
    if(types.length === 1){
        if(types[0] !== Request) {
            const errorMessage = `Index signature of ${key}(${types.map(a => a.name).join()}) does not fit (Request) => void`;
            throw new Error(errorMessage);
        }
    }
    if(types.length === 2){
        if (types[0] !== Request || types[1] !== Response || types.length !== 2) {
            const errorMessage = `Index signature of ${key}(${types.map(a => a.name).join()}) does not fit (Request, Response) => void`;
            throw new Error(errorMessage);
        }
    }
    if (types.length >= 3) {
        if (types[0] === Function) {
            const errorMessage = `Index signature of ${key}(${types.map(a => a.name).join()}) does not fit (Request, Response, Function) => void`;
            throw new Error(errorMessage);
        }
    }
}
