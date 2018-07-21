/**
 * @module Non-exported
 */
import 'reflect-metadata'
import { Instantiable } from '../internal.index';
import { injectorStore } from '../../target/store/injector.store';

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
        return new instance(...injections);
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
        return new instance(...injections);
    }



};
