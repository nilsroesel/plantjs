/**
 * @module Decorators
 */
import * as http from 'http';
import * as https from 'https';
import * as colors from 'colors/safe';
import { ApplicationConfig, Middleware} from '../index';
import {
    ComponentStore,
    componentStore,
    EndpointHandler,
    Injector,
    ModuleStore,
    moduleStore,
    RequestListenerFactory,
    Router
} from '../internal.index';

/**
 *
 * Class Decorator Function
 *
 * Creates a runner upon a class. No need to create an object and to serve manually
 * @returns
 *
 * @example
 * ```typescript
 *
 *   @Application({
 *      contentType: 'application/json',
 *      server: {
 *          port: 3000,
 *          maxConnections: 10,
 *          timeout: 500,
 *          keepAliveTimeout: 500
 *      },
 *      components: [TestComponent],
 *      middleware: [(request: Request, response: Response) => { }]
 *   })
 *   class Test {}
 * ```
 * **/
export function Application(config: ApplicationConfig) {
    console.log();
    const applicationMiddleWare: Middleware = config.middleware || [];
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        // Add application class as main component to the store
        if (componentStore.has(constructor.name)) {
            const store: ComponentStore = componentStore.get(constructor.name);
            store.componentRoute = '';
            store.componentMiddleware = [];
            componentStore.set(constructor.name, store);
        }

        const router: Router = new Router();
        config.components.concat(constructor).forEach(Component => {
            const componentName: string = (Component as Function).name;
            if (componentStore.has(componentName)) {
                const storedComponent = componentStore.get(componentName);
                // Instantiate via dependency injector
                const component = Injector.resolve(Component);
                if (storedComponent.endpoints) {
                    storedComponent.endpoints.forEach(endpoint => {
                        const middleware: Middleware = applicationMiddleWare
                            .concat(storedComponent.componentMiddleware)
                            .concat(endpoint.middleware);
                        const endpointWithInjectedDependencies: EndpointHandler = {
                            functionContextInstance: component,
                            fn: endpoint.fn,
                            route: endpoint.route,
                            middleware: middleware
                        };
                        const route = (storedComponent.componentRoute || '').concat(endpoint.route).replace(/\/\//g, '/');
                        if (router.has(route)) console.warn(colors.yellow(`[WARNING]\tFound duplicated route '${route}'. Route was overridden`));
                        router.set(route, endpointWithInjectedDependencies);
                    });
                }
            }  else { throw new Error(`Component ${Component} has no mapped class`); }
        });

        (config.modules || []).forEach(Module => {
            const moduleName: string = (Module as Function).name;
            if (moduleStore.has(moduleName)) {
                const storedModule: ModuleStore = moduleStore.get(moduleName);
                storedModule.components.forEach(Component => {
                    const componentName: string = (Component as Function).name;
                    if (componentStore.has(componentName)) {
                        const storedComponent = componentStore.get(componentName);
                        // Instantiate via dependency injector
                        const component = Injector.resolveModuleInstance(Component);
                        if (storedComponent.endpoints) {
                            storedComponent.endpoints.forEach(endpoint => {
                                const middleware: Middleware = applicationMiddleWare
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
                                if (router.has(route)) console.warn(colors.yellow(`[WARNING]\tFound duplicated route '${route}'. Route was overridden`));
                                router.set(route, endpointWithInjectedDependencies);
                            });
                        }
                    } else { throw new Error(`Component ${Component} has no mapped class`); }
                });
            } else { throw new Error(`Module ${Module} has no mapped class`); }
        });

        if (config.server.https) {
            https.createServer(config.server.https, RequestListenerFactory(config, router))
                .listen(config.server.port || 443, () =>{
                    console.log(colors.green(`[SUCCESS]\tApi is up and listening on port ${config.server.port || 443}`));
                    console.log('[INFO]\t\tUsing schema https');
                });
            if (config.server.https.allowHttp) {
                http.createServer(RequestListenerFactory(config, router))
                    .listen(config.server.port || 80, () => {
                        console.log(colors.green(`[SUCCESS]\tApi is up and listening on port ${config.server.https.httpPort || 80}`));
                        console.log('[INFO]\t\tUsing schema http');
                    });
            }
        } else {
            http.createServer(RequestListenerFactory(config, router))
                .listen(config.server.port || 80, () => {
                    console.log(colors.green(`[SUCCESS]\tApi is up and listening on port ${config.server.port || 80}`));
                    console.log('[INFO]\t\tUsing schema http');
                });
        }
    }
}
