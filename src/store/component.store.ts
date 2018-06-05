/**
 * @module Non-exported
 */
import { EndpointHandler } from '../decorators/internal.index';
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

/**
 * @hidden
 * Map a decorator class name to original class name class_1 -> Foo
 */
export const componentClassMap: Map<string, string> = new Map();
