/**
 * @module Decorators
 */
import 'reflect-metadata';
import { EndpointConfig, Middleware, Request, Response } from '../index';
import { componentStore, ComponentStore } from '../internal.index';

/**
 *
 * Property Decorator Function
 *
 * Creates an endpoint of a function
 * The decorated function need the following index signature otherwise it will throw an error
 * (request: Request, response: Response, next?: Function) (also an indexsignature fore middlewares)
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
    const middleware = config.middleware || [];
    return (target: Object, key: string) => {
        checkHandlerFunctionIndexSignature(target, key);
        if (componentStore.has(target.constructor.name)) {
            const store: ComponentStore = componentStore.get(target.constructor.name);
            store.endpoints.push({
                functionContextInstance: target,
                fn: target[key] as Function,
                route: config.route || '',
                middleware: middleware
            });
            componentStore.set(target.constructor.name, store);
        } else {
            componentStore.set(target.constructor.name, {
                componentMiddleware: [] as Middleware,
                componentRoute: null,
                endpoints: new Array<EndpointHandler>({
                    functionContextInstance: target,
                    fn: target[key] as Function,
                    route: config.route || '',
                    middleware: middleware
                })
            });
        }
    };
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
