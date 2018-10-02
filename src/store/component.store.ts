/**
 * @module Non-exported
 */
import { EndpointHandler, Instantiable } from '../internal.index';
import { Middleware } from '../interfaces';

/**
 * @hidden
 */
export interface ComponentStore {
    componentRoute: string;
    componentMiddleware: Middleware;
    endpoints: Array<EndpointHandler>;
    get: Array<EndpointHandler>;
    post: Array<EndpointHandler>;
    put: Array<EndpointHandler>;
    delete: Array<EndpointHandler>;
    patch: Array<EndpointHandler>;
}

/**
 * @hidden
 */
export const componentStore: Map<string, ComponentStore> = new Map();
