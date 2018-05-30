import 'reflect-metadata'
import { Instantiable } from '../internal.index';

/**
 * @hidden
 */
export const Injector = new class {

    resolve<T>(instance: Instantiable<T>): T {
        // Tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens = Reflect.getMetadata('design:paramtypes', instance) || [],
            injections = tokens.map(token => Injector.resolve<any>(token));
        return new instance(...injections);
    }

    resolveAsync<T>(instance: Instantiable<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                // Tokens are required dependencies, while injections are resolved tokens from the Injector
                let tokens = Reflect.getMetadata('design:paramtypes', instance) || [],
                    injections = tokens.map(token => Injector.resolve<any>(token));
                resolve(new instance(...injections));
            } catch (e) { reject(e); }
        });
    }
};
