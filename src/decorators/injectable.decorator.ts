import { Instantiable, GenericClassDecorator } from '../internal.index';

/**
 * Class Decorator Function
 *
 * Allows to inject dependencies into objects
 * @returns
 *
 * @example
 * ```typescript
 *
 *   @Injectable()
 *   class InjectedDependency {
 *      public foo = 'foo'
 *   }
 *
 *   class Target {
 *      constructor (private foo: InjectedDependency);
 *
 *      getFoosFoo() { return this.foo.foo }
 *   }
 * ```
 * **/
export function Injectable(): GenericClassDecorator<Instantiable<object>> {
    return (target: Instantiable<object>) => {
        // do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
    };
}
