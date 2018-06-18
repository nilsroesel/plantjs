/**
 * @module Decorator-Configs
 */
import { Middleware } from './index';

export interface ApplicationConfig {
    contentType: string;
    server: {
        port: number;
        maxConnections: number;
        timeout: number;
        keepAliveTimeout: number;
        https?: HttpsOptions;
    }
    middleware?: Middleware;
    components?: Array<Function extends { new(...args: any[]): {} }>;
}

export interface HttpsOptions {
    key: string | Buffer;
    cert: string | Buffer;
    ca: string | Buffer;
    requestCert: boolean;
    rejectUnauthorized: boolean;
}
