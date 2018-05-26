import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { ApplicationConfig, HandlerFn, Request, Response, Router, Route } from '../index';
import { SubComponent } from './endpoint.decorator';

export function Application(config: ApplicationConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const router: Router = new Router();
        config.components.forEach(Component => {
            const component = new Component();
            if (component['skeidjs']) {
                (component['skeidjs'] as Array<SubComponent>).forEach(subComponent => {
                    router.set((component['skeidjsComponentRoute'] as string || '').concat(subComponent.route).replace(/\/\//g, '/'),
                        (subComponent.function as HandlerFn));
                });
            }
        });
        http.createServer((request: IncomingMessage, response: ServerResponse) => {
            const route: Promise<Route> = router.getRouteFromUrl(request.url);
            route.then(route => {
                response.setHeader('Content-Type', config.contentType);
                Request.readRequestBody(request).then(body => {
                    route.handlerFn(new Request(request, body, route.params), new Response(response));
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
