/**
 * @module Decorators
 */
import { ComponentConfig, Request, Response } from '../index';

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
        return class extends constructor {
            skeidjsComponentRoute = conf.route;
            skeidjsComponentMiddleware = conf.middleware || [];
        }
    }
}
