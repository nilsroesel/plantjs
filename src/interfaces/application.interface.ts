export interface ApplicationConfig {
    contentType: string;
    server: {
        port: number;
        maxConnections: number;
        timeout: number;
        keepAliveTimeout: number;
    }
    providers?: Array<any>;
    components?: Array<Function extends { new(...args: any[]): {} }>;
}
