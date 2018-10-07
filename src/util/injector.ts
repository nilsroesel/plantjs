/**
 * @module Non-exported
 */
import 'reflect-metadata'
import { Instantiable, injectorStore } from '../internal.index';
import { OnInit, implementsOnInit } from '../index';

/**
 * @hidden
 */
export const Injector = new class {

    resolve<T>(instance: Instantiable<T>): T {
        // Tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens = Reflect.getMetadata('design:paramtypes', instance) || [],
            injections = tokens.map(token => {
                if (injectorStore.has(token)) {
                    let storeVal = injectorStore.get(token);
                    if (storeVal === null) {
                        storeVal = Injector.resolve<any>(token);
                        injectorStore.set(token, storeVal)
                    }
                    return storeVal;
                }
                else {
                    return Injector.resolve<any>(token);
                }
            });
        const instantiated: T = new instance(...injections);
        if (implementsOnInit(instantiated)) (instantiated as OnInit).onInit();
        return instantiated;
    }

    resolveModuleInstance<T>(instance: Instantiable<T>, store?: Map<Instantiable<any>, Object>): T {
        const moduleStore: Map<Instantiable<any>, Object> = store || new Map();
        let tokens = Reflect.getMetadata('design:paramtypes', instance) || [],
            injections = tokens.map(token => {
                if (injectorStore.has(token)) {
                    if (moduleStore.has(token)) {
                        let storeVal = moduleStore.get(token);
                        if (storeVal === null) {
                            storeVal = Injector.resolveModuleInstance<any>(token, moduleStore);
                            moduleStore.set(token, storeVal)
                        }
                        return storeVal;
                    } else {
                        return injectorStore || Injector.resolveModuleInstance<any>(token, moduleStore);
                    }
                } else {
                    return Injector.resolveModuleInstance<any>(token, moduleStore);
                }
            });
        const instantiated: T = new instance(...injections);
        if (implementsOnInit(instantiated)) (instantiated as OnInit).onInit();
        return instantiated;
    }

};
