/**
 * @module Non-exported
 */

import { ComponentStore, componentStore } from '../store/component.store';
import { EndpointConfig, Middleware } from '../interfaces';
import { checkHandlerFunctionIndexSignature, EndpointHandler } from '../decorators/endpoint.decorator';

/**
 * @hidden
 */
export class EndpointFactory {

    static generateEndpointLogic(config: EndpointConfig, endpointTypeList?: EndpointTypes): (target: Object, key: string) => void {
        const middleware = config.middleware || [];
        const selectedEndpointArray: string = endpointTypeList || 'endpoint';
        return (target: Object, key: string) => {
            checkHandlerFunctionIndexSignature(target, key);
            if (componentStore.has(target.constructor.name)) {
                const store: ComponentStore = componentStore.get(target.constructor.name);
                store[selectedEndpointArray].push({
                    functionContextInstance: target,
                    fn: target[key] as Function,
                    route: config.route || '',
                    middleware: middleware
                });
                componentStore.set(target.constructor.name, store);
            } else {
                const stored: ComponentStore = {
                    componentMiddleware: [] as Middleware,
                    componentRoute: null,
                    endpoints: [],
                    get: [],
                    post: [],
                    patch: [],
                    put: [],
                    delete: []
                };
                stored[selectedEndpointArray] = new Array<EndpointHandler>({
                    functionContextInstance: target,
                    fn: target[key] as Function,
                    route: config.route || '',
                    middleware: middleware
                });
                componentStore.set(target.constructor.name, stored);
            }
        };
    }
}

/**
 * @hidden
 */
export enum EndpointTypes {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}
