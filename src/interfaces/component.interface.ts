/**
 * @module Decorator-Configs
 */
import { Middleware } from './index';

export interface ComponentConfig {
    route?: string;
    middleware?: Middleware;
}
