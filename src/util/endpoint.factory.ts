/**
 * @module Non-exported
 */

import { ComponentStore, componentStore, Router, Routers } from '../internal.index';
import { EndpointConfig, Middleware } from '../interfaces';
import { checkHandlerFunctionIndexSignature, EndpointHandler } from '../decorators/endpoint.decorator';
import * as colors from 'colors/safe';

/**
 * @hidden
 */
export class EndpointFactory {

    static generateEndpointLogic(config: EndpointConfig, endpointTypeList?: EndpointTypes): (target: Object, key: string) => void {
        const middleware = config.middleware || [];
        const selectedEndpointArray: string = endpointTypeList || 'endpoints';
        return (target: Object, key: string) => {
            checkHandlerFunctionIndexSignature(target, key);
            if (componentStore.has(target.constructor.name)) {
                const store: ComponentStore = componentStore.get(target.constructor.name);
                (store[selectedEndpointArray] as Array<EndpointHandler>).push({
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
                    endpoints: [] as Array<EndpointHandler>,
                    get: [] as Array<EndpointHandler>,
                    post: [] as Array<EndpointHandler>,
                    patch: [] as Array<EndpointHandler>,
                    put: [] as Array<EndpointHandler>,
                    delete: [] as Array<EndpointHandler>
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

    static pushModuleEndpointToRoute(router: Router, component: any,
                                     storedModule: any, storedComponent: any, applicationMiddleware: Middleware, routerMap: Routers) {
        return endpoint => {
            const middleware: Middleware = applicationMiddleware
                .concat(storedModule.moduleMiddleWare)
                .concat(storedComponent.componentMiddleware)
                .concat(endpoint.middleware);
            const endpointWithInjectedDependencies: EndpointHandler = {
                functionContextInstance: component,
                fn: endpoint.fn,
                route: endpoint.route,
                middleware: middleware
            };
            const route = storedModule.moduleRoute.concat(storedComponent.componentRoute || '').concat(endpoint.route).replace(/\/\//g, '/');
            if (router.has(route, routerMap)) console.warn(colors.yellow(`[WARNING]\tFound duplicated route '${route}'. Route was overridden`));
            router.set(route, endpointWithInjectedDependencies, routerMap);
        };
    }

    static pushEndpointToRoute(router: Router, component: any,
                               storedComponent: any, applicationMiddleware: Middleware, routerMap: Routers) {
        return endpoint => {
            const middleware: Middleware = applicationMiddleware
                .concat(storedComponent.componentMiddleware)
                .concat(endpoint.middleware);
            const endpointWithInjectedDependencies: EndpointHandler = {
                functionContextInstance: component,
                fn: endpoint.fn,
                route: endpoint.route,
                middleware: middleware
            };
            const route = (storedComponent.componentRoute || '').concat(endpoint.route).replace(/\/\//g, '/');
            if (router.has(route, routerMap)) console.warn(colors.yellow(`[WARNING]\tFound duplicated route '${route}'. Route was overridden`));
            router.set(route, endpointWithInjectedDependencies, routerMap);
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
