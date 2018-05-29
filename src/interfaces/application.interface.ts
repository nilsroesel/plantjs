import { Middleware } from './index';

export interface ApplicationConfig {
    contentType: string;
    server: {
        port: number;
        maxConnections: number;
        timeout: number;
        keepAliveTimeout: number;
    }
    middleware?: Middleware;
    components?: Array<Function extends { new(...args: any[]): {} }>;
}
