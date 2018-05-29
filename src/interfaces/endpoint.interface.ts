import { Middleware } from './index';

export interface EndpointConfig {
    route: string;
    middleware?: Middleware;
}
