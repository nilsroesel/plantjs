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

/**
 * @hidden
 */
export function emptyComponent(): ComponentStore {
    return <ComponentStore>{
        componentMiddleware: [] as Middleware,
        componentRoute: null,
        endpoints: [] as Array<EndpointHandler>,
        get: [] as Array<EndpointHandler>,
        post: [] as Array<EndpointHandler>,
        patch: [] as Array<EndpointHandler>,
        put: [] as Array<EndpointHandler>,
        delete: [] as Array<EndpointHandler>
    };
}