/**
 * @module Non-exported
 */
import { Middleware, MiddlewareFunction } from '../index';
import { EndpointHandler, Route } from '../internal.index';

/**
 * @hidden
 */
export class Router {

    static readonly NO_SUCH_ROUTE = 'NO_SUCH_ROUTE';

    private unspecifiedRoutes: Map<string, EndpointHandler>;

    private deleteRoutes: Map<string, EndpointHandler>;

    private getRoutes: Map<string, EndpointHandler>;

    private postRoutes: Map<string, EndpointHandler>;

    private patchRoutes: Map<string, EndpointHandler>;

    private putRoutes: Map<string, EndpointHandler>;

    constructor() {
        this.unspecifiedRoutes = new Map();
        this.deleteRoutes = new Map();
        this.getRoutes = new Map();
        this.postRoutes = new Map();
        this.patchRoutes = new Map();
        this.putRoutes = new Map();
    }

    private static transformRouteToRegEx(route: string) {
        return '^'.concat(
            route
            // Escape all common regex tokens
                .replace(/\//g, '\\/')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
                .replace(/\[/g, '\\[')
                .replace(/]/g, '\\]')
                .replace(/\$/g, '\\$')
                // Convert params to regex
                .replace(/:[^/\[]+#number/gi, '(\\d+)') // Number typed param
                .replace(/:[^/\[]+#hex/gi, '(\[0-9a-fA-F\]+)') // Number typed param
                .replace(/:[^/\[]+#alpha/gi, '(\[a-zA-Z\]+)') // Number typed param
                .replace(/:[^\\/\[]+/g, '([^\/]+)') // Params are any value

                // Solves '/foo/bar' !== '/foo/bar/'
                .replace(/\/$/, '')
                .concat('\/*$')
        );
    }

    static readParamsFromUrl(url: string, pattern: string, transformedRouteRegExp: string | RegExp): Object {
        const params = Object.assign({}, {});
        const plainKeys = pattern.match(/:[^\/]*/g);
        if (plainKeys) {
            const paramValues = new RegExp(transformedRouteRegExp).exec(url);
            plainKeys
                .map(key => {
                    return key
                        .replace(':', '')
                        .replace('#number', '')
                        .replace('#hex', '')
                        .replace('#alpha', '');
                })
                .forEach((key, index) => {
                    params[key] = paramValues[index + 1];
                });
        }
        return params;
    }

    getRouteFromUrl(url: string, map: Routers = Routers.UNSPECIFIED): Promise<Route> {
        return new Promise<Route>((resolve, reject) => {
            const routerFunction = (val: EndpointHandler, key: string) => {
                // Transform route into a regex to match url ->^route-with-params-$
                const regExString = Router.transformRouteToRegEx(key);
                const functionChain: Middleware = val.middleware.concat(<MiddlewareFunction>{
                    functionContextInstance: val.functionContextInstance,
                    fn: val.fn
                });
                if (new RegExp(regExString).test(url)) resolve(new Route(functionChain, Router.readParamsFromUrl(url, key, regExString), val.errorHandler));
            };
            if(map !== Routers.UNSPECIFIED && map) (this[map] as Map<string, EndpointHandler>).forEach(routerFunction);
            this.unspecifiedRoutes.forEach(routerFunction);
            reject(Router.NO_SUCH_ROUTE);
        });
    }

    set(key: string, value: EndpointHandler, map: Routers = Routers.UNSPECIFIED): void {
        (this[map] as Map<string, EndpointHandler>).set(key, value);
    }

    get(key: string, map: Routers = Routers.UNSPECIFIED): EndpointHandler {
        return (this[map] as Map<string, EndpointHandler>).get(key);
    }

    has(key: string, map: Routers = Routers.UNSPECIFIED): boolean {
        return (this[map] as Map<string, EndpointHandler>).has(key);
    }

}

/**
 * @hidden
 */
export enum Routers {
    UNSPECIFIED = 'unspecifiedRoutes',
    DELETE = 'deleteRoutes',
    GET = 'getRoutes',
    POST = 'postRoutes',
    PATCH = 'patchRoutes',
    PUT = 'putRoutes'
}
