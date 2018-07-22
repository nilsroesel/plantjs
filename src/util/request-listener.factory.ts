/**
 * @module Non-exported
 */
import { ApplicationConfig, Request, Response } from '../index';
import { RequestListenerFn, Route, Router } from '../internal.index';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * @hidden
 */
export function RequestListenerFactory(config: ApplicationConfig, router: Router): RequestListenerFn {
    return (request: IncomingMessage, response: ServerResponse) => {
        const route: Promise<Route> = router.getRouteFromUrl(request.url);
        route.then(route => {
            response.setHeader('Content-Type', config.contentType);
            Request.readRequestBody(request).then(body => {
                route.call(new Request(request, body, route.params), new Response(response));
            }).catch(reason => {
                response.writeHead(500, reason, {'Content-Type': config.contentType});
                response.end();
            });
        }).catch(reason => {
            if (reason === Router.NO_SUCH_ROUTE) {
                response.writeHead(404, {'Content-Type': config.contentType});
                response.end();
            } else {
                response.writeHead(500, {'Content-Type': config.contentType});
                response.end();
            }
        });
    };
}
