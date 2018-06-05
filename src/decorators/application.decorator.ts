/**
 * @module Decorators
 */
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { ApplicationConfig, Middleware, Request, Response } from '../index';
import { Injector, Router, Route, EndpointHandler, componentStore, componentClassMap } from '../internal.index';

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
    const applicationMiddleWare: Middleware = config.middleware || [];
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const router: Router = new Router();
        config.components.forEach(Component => {
            const componentName: string = (Component as Function).name;
            if(componentStore.has(componentClassMap.get(componentName))) {
                const store = componentStore.get(componentClassMap.get(componentName));
                // Instantiate via singletone -> dependency injector
                const component = Injector.resolve(Component);
                if (store.endpoints) {
                    store.endpoints.forEach(endpoint => {
                        const middleware: Middleware = applicationMiddleWare
                            .concat(store.componentMiddleware)
                            .concat(endpoint.middleware);
                        const endpointWithInjectedDependencies: EndpointHandler = {
                            functionContextInstance: component,
                            fn: endpoint.fn,
                            route: endpoint.route,
                            middleware: middleware
                        };
                        const route = (store.componentRoute || '').concat(endpoint.route).replace(/\/\//g, '/');
                        if (router.has(route)) console.warn(`Found duplicated route '${route}'. Route was overridden`);
                        router.set(route, endpointWithInjectedDependencies);
                    });
                }
            }  else { throw new Error(`Component ${Component} has no mapped class`); }
        });
        http.createServer((request: IncomingMessage, response: ServerResponse) => {
            const route: Promise<Route> = router.getRouteFromUrl(request.url);
            route.then(route => {
                response.setHeader('Content-Type', config.contentType);
                Request.readRequestBody(request).then(body => {
                    route.call(new Request(request, body, route.params), new Response(response));
                    if (!response.finished) response.end();
                }).catch(e => {});
            }).catch(reason => {
                if (reason === Router.NO_SUCH_ROUTE) {
                    response.writeHead(404, {'Content-Type': config.contentType});
                    response.end();
                } else {
                    response.writeHead(500, {'Content-Type': config.contentType});
                    response.end();
                }
            });

        }).listen(config.server.port || 3000, () => console.log(`Server is up and listening to port ${config.server.port || 3000}`));
    }
}
