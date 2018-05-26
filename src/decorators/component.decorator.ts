import { ComponentConfig } from '../index';

export function Component(conf: ComponentConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            plantJsComponentRoute = conf.route;
        }
    }
}
