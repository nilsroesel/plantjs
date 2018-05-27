import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { ApplicationConfig, Injector, Request, Response, Router, Route, EndpointHandler } from '../index';

export function Application(config: ApplicationConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const router: Router = new Router();
        config.components.forEach(Component => {
            // Instantiate via singletone -> dependency injector
            const component = Injector.resolve(Component);
            if (component['skeidjs']) {
                (component['skeidjs'] as Array<EndpointHandler>).forEach(subComponent => {
                    const endpointWithInjectedDependencies: EndpointHandler = {
                        functionInstance: component,
                        functionKey: subComponent.functionKey,
                        route: subComponent.route
                    };
                    const route = (component['skeidjsComponentRoute'] as string || '').concat(subComponent.route).replace(/\/\//g, '/');
                    if (router.has(route)) console.warn(`Found duplicated route '${route}'. Route was overridden`);
                    router.set(route, endpointWithInjectedDependencies);
                });
            }
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
