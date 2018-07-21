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
}

/**
 * @hidden
 */
export const componentStore: Map<string, ComponentStore> = new Map();
