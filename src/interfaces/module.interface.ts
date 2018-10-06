/**
 * @module Decorator-Configs
 */
import { Middleware } from './index';
import { Instantiable } from './internal.index';

export interface ModuleConfig {
    route?: string;
    components?: Array<Instantiable<any>>;
    middleware?: Middleware;
    providers?: Array<Instantiable<any>>;
}
