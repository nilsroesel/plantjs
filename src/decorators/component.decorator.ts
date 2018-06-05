/**
 * @module Decorators
 */
import { ComponentConfig, Request, Response } from '../index';
import { componentStore, componentClassMap, ComponentStore } from '../internal.index';

/**
 *
 * Class Decorator Function
 *
 * A collection of endpoints. Every endpoints in this will apply the given metadata.
 * Add the class Symbols to the application components array (similar to angular module)
 * to apply them to an application
 * @returns
 *
 * @example
 * ```typescript
 *
 *   @Component({
 *      route: '/api',
 *      middleware: [(request: Request, response: Response) => { }]
 *   })
 *   class Test {}
 * ```
 * **/
export function Component(conf: ComponentConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const returnedClass = class extends constructor {};
        if(componentStore.has(constructor.name)) {
            const store: ComponentStore = componentStore.get(constructor.name);
            store.componentRoute = conf.route;
            store.componentMiddleware = conf.middleware || [];

            componentStore.set(returnedClass.name, store);
            componentClassMap.set(returnedClass.name, constructor.name);

        }

        return returnedClass;
    }
}
