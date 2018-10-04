/**
 * @module Non-exported
 */
import { ApplicationConfig, Request, Response } from '../../index';
import { RequestListenerFn, Route, Router, Routers } from '../../internal.index';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * @hidden
 */
function createHttpToRouterMap(): Map<string, Routers> {
    const httpToRouterMap: Map<string, Routers> = new Map();
    httpToRouterMap.set('GET', Routers.GET);
    httpToRouterMap.set('POST', Routers.POST);
    httpToRouterMap.set('DELETE', Routers.DELETE);
    httpToRouterMap.set('PUT', Routers.PUT);
    httpToRouterMap.set('PATCH', Routers.PATCH);
    return httpToRouterMap;
}

/**
 * @hidden
 */
export function RequestListenerFactory(config: ApplicationConfig, router: Router): RequestListenerFn {
    return (request: IncomingMessage, response: ServerResponse) => {
        const route: Promise<Route> = router.getRouteFromUrl(request.url, createHttpToRouterMap().get(request.method) || Routers.UNSPECIFIED);
        route.then(route => {
            response.setHeader('Content-Type', config.contentType);
            Request.readRequestBody(request).then(body => {
                route.call(new Request(request, body.toString(), body, route.params), new Response(response));
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
