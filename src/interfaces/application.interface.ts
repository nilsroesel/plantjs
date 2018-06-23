/**
 * @module Decorator-Configs
 */
import { Middleware } from './index';

/**
 * httpPort default 80, https default 443
 */
export interface ApplicationConfig {
    contentType: string;
    server: {
        port?: number;
        maxConnections?: number;
        timeout?: number;
        keepAliveTimeout?: number;
        https?: HttpsOptions;
    }
    middleware?: Middleware;
    components?: Array<Function extends { new(...args: any[]): {} }>;
}

export interface HttpsOptions {
    allowHttp?: boolean;
    httpPort?: number;
    key: string | Buffer;
    cert: string | Buffer;
    ca: string | Buffer;
    crl: string | Buffer;
    requestCert: boolean;
    rejectUnauthorized: boolean;
}
