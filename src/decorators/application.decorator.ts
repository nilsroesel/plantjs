/**
 * @module Decorators
 */
import * as http from 'http';
import * as https from 'https';
import * as colors from 'colors/safe';
import { ApplicationConfig, Middleware } from '../index';
import {
    ComponentStore,
    componentStore,
    EndpointFactory, EndpointHandler,
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
        } else {
            componentStore.set(constructor.name, <ComponentStore>{
                componentMiddleware: [] as Middleware,
                componentRoute: null,
                endpoints: [] as Array<EndpointHandler>,
                get: [] as Array<EndpointHandler>,
                post: [] as Array<EndpointHandler>,
                patch: [] as Array<EndpointHandler>,
                put: [] as Array<EndpointHandler>,
                delete: [] as Array<EndpointHandler>
            });
        }

        const router: Router = new Router();
        (config.components || [])
            .concat(constructor)
            .forEach(Component => EndpointFactory.resolveComponentEndpoints(Component, applicationMiddleWare, router));

        (config.modules || []).forEach(Module => EndpointFactory.resolveModuleEndpoints(Module, applicationMiddleWare, router));

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
