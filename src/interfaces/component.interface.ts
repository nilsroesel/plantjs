import { HandlerFn } from '../index';

export interface ComponentConfig {
    route?: string;
    middleware?: Array<HandlerFn>;
}
