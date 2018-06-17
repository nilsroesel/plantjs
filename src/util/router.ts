/**
 * @module Non-exported
 */
import { Middleware } from '../index';
import { EndpointHandler, Route } from '../internal.index';

/**
 * @hidden
 */
export class Router {

    static readonly NO_SUCH_ROUTE = 'NO_SUCH_ROUTE';

    private routeMap: Map<string, EndpointHandler>;

    constructor() { this.routeMap = new Map(); }

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

    getRouteFromUrl(url: string): Promise<Route> {
        return new Promise<Route>((resolve, reject) => {
            this.routeMap.forEach((val: EndpointHandler, key: string) => {
                // Transform route into a regex to match url ->^route-with-params-$
                const regExString =
                    '^'.concat(
                        key
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
                const functionChain: Middleware = val.middleware.concat({
                    functionContextInstance: val.functionContextInstance,
                    fn: val.fn
                });
                if (new RegExp(regExString).test(url)) resolve(new Route(functionChain, Router.readParamsFromUrl(url, key, regExString)));
            });
            reject(Router.NO_SUCH_ROUTE);
        });
    }

    set(key: string, value: EndpointHandler): void { this.routeMap.set(key, value); }

    get(key: string): EndpointHandler { return this.routeMap.get(key); }

    has(key: string): boolean { return this.routeMap.has(key); }

}
