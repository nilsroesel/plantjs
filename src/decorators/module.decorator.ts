/**
 * @module Decorators
 */

import { ModuleConfig } from '../index';
import { ComponentStore, componentStore, emptyComponent, moduleStore, ModuleStore } from '../internal.index';

/**
 *
 * Class Decorator Function
 *
 * A module gathers components and uses an own store for shared instances dependency injection.
 * Every not provided dependency will be loaded from the application instance store
 * @returns
 *
 * @example
 * ```typescript
 *
 *   @Module({
 *
 *   })
 *   class Test {}
 * ```
* **/
export function Module(config: ModuleConfig) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const store: ModuleStore = moduleStore.get(constructor.name) || {} as ModuleStore;
        store.components = config.components || [];
        store.moduleMiddleWare = config.middleware || [];
        store.moduleRoute = config.route || '';
        store.providers = config.providers || [];
        store.modules = config.modules || [];
        moduleStore.set(constructor.name, store);

        if (componentStore.has(constructor.name)) {
            const store: ComponentStore = componentStore.get(constructor.name);
            store.componentRoute = '';
            store.componentMiddleware = [];
            componentStore.set(constructor.name, store);
        } else {
            const store: ComponentStore = emptyComponent();
            componentStore.set(constructor.name, store);
        }

        return constructor;
    }
}