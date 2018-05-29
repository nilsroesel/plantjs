import { ComponentConfig, Request, Response } from '../index';

export function Component(conf: ComponentConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            skeidjsComponentRoute = conf.route;
            skeidjsComponentMiddleware = conf.middleware || [];
        }
    }
}
