/**
 * @module Non-exported
 */

import {
    checkHandlerFunctionIndexSignature,
    ComponentStore,
    componentStore,
    emptyComponent,
    EndpointHandler,
    Injector,
    ModuleStore,
    moduleStore,
    Router,
    Routers
} from '../../internal.index';
import { EndpointConfig, Middleware } from '../../index';
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
                const stored: ComponentStore = emptyComponent();
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

    private static pushEndpointToRoute(router: Router, component: any,
                                       storedComponent: any, routerMap: Routers, parentMiddleware: Middleware, parentRoute: string) {
        return endpoint => {
            const middleware: Middleware = parentMiddleware
                .concat(storedComponent.componentMiddleware)
                .concat(endpoint.middleware);
            const endpointWithInjectedDependencies: EndpointHandler = {
                functionContextInstance: component,
                fn: endpoint.fn,
                route: endpoint.route,
                middleware: middleware
            };
            const route = parentRoute.concat(storedComponent.componentRoute || '').concat(endpoint.route).replace(/\/\//g, '/');
            if (router.has(route, routerMap)) console.warn(colors.yellow(`[WARNING]\tFound duplicated route '${route}'. Route was overridden`));
            router.set(route, endpointWithInjectedDependencies, routerMap);
        };
    }

    static resolveComponentEndpoints(Component: { new(...args: any[]): {} }, applicationMiddleware: Middleware, router: Router, parentRoute: string = '') {
        const componentName: string = (Component as Function).name;
        if (componentStore.has(componentName)) {
            const storedComponent = componentStore.get(componentName);
            // Instantiate via dependency injector
            const component = Injector.resolve(Component);
            (storedComponent.endpoints || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.UNSPECIFIED,
                    applicationMiddleware,
                    parentRoute));

            (storedComponent.get || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.GET,
                    applicationMiddleware,
                    parentRoute));

            (storedComponent.post || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.POST,
                    applicationMiddleware,
                    parentRoute));

            (storedComponent.delete || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.DELETE,
                    applicationMiddleware,
                    parentRoute));

            (storedComponent.patch || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.PATCH,
                    applicationMiddleware,
                    parentRoute));

            (storedComponent.put || [])
                .forEach(EndpointFactory.pushEndpointToRoute(
                    router,
                    component,
                    storedComponent,
                    Routers.PUT,
                    applicationMiddleware,
                    parentRoute));

        } else {
            throw new Error(`Component ${Component} has no mapped class`);
        }

    }

    static resolveModuleEndpoints(Module: { new(...args: any[]): {} }, applicationMiddleware: Middleware, router: Router, parentRoute: string = '') {
        const moduleName: string = (Module as Function).name;
        if (moduleStore.has(moduleName)) {
            const storedModule: ModuleStore = moduleStore.get(moduleName);
            const middleware: Middleware = applicationMiddleware.concat(storedModule.moduleMiddleWare);
            const route = parentRoute.concat(storedModule.moduleRoute);
            storedModule.components.concat([Module]).forEach(Component => EndpointFactory.resolveComponentEndpoints(Component, middleware, router, route));
            storedModule.modules.forEach(ChildModule => EndpointFactory.resolveModuleEndpoints(ChildModule, middleware, router, route));
        }
        else {
            throw new Error(`Module ${Module} has no mapped class`);
        }
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
