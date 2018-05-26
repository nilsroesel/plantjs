import { HandlerFn } from '../interfaces/handler-functions';
import { Route } from './route'

export class Router {

    static readonly NO_SUCH_ROUTE = 'NO_SUCH_ROUTE';

    private routeMap: Map<string, HandlerFn>;

    constructor() { this.routeMap = new Map(); }

    static readParamsFromUrl(url: string, pattern: string, transformedRouteRegExp: string | RegExp): Object {
        const params = Object.assign({}, {});
        const plainKeys = pattern.match(/:[^\/]*/g);
        if (plainKeys) {
            const paramValues = new RegExp(transformedRouteRegExp).exec(url);
            plainKeys
                .map(key => key.replace(':', '').replace('[number]', ''))
                .forEach((key, index) => {
                    params[key] = paramValues[index + 1];
                });
        }
        return params;
    }

    getRouteFromUrl(url: string): Promise<Route> {
        return new Promise<Route>((resolve, reject) => {
            this.routeMap.forEach((val: HandlerFn, key: string) => {
                // Transform route into a regex to match url
                const regExString = key
                // Escape all common regex tokens
                    .replace(/\//g, '\\/')
                    .replace(/\(/g, '\\(')
                    .replace(/\)/g, '\\)')
                    .replace(/\[/g, '\\[')
                    .replace(/\]/g, '\\]')
                    .replace(/\$/g, '\\$')
                    // Convert params to regex
                    .replace(/:[^\\/\[]*\[number\]/g, '(\\d+)') // Number typed param
                    .replace(/:[^\/]*/g, '([^\/]+)') // Params are any value
                    .replace(/\/$/, '') // Solves '/foo/bar' !== '/foo/bar/'
                    .concat('\/*$');
                if (new RegExp(regExString).test(url)) resolve(new Route(val, Router.readParamsFromUrl(url, key, regExString)));
                else reject(Router.NO_SUCH_ROUTE);
            });
        });
    }

    set(key: string, value: HandlerFn): void { this.routeMap.set(key, value); }

    get(key: string): HandlerFn { return this.routeMap.get(key); }

}
