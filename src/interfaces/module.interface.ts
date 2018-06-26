/**
 * @module Decorator-Configs
 */
import { Middleware } from './index';
import { Instantiable } from './types';

export interface ModuleConfig {
    route?: string;
    components?: Array<{ new(...args: any[]): {} }>;
    middleware?: Middleware;
    providers?: Array<Instantiable<any>>;
}
