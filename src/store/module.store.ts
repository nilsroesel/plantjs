/**
 * @module Non-exported
 */
import { Middleware } from '../interfaces';
import { Instantiable } from '../interfaces/types';

/**
 * @hidden
 */
export interface ModuleStore {
    moduleRoute: string;
    moduleMiddleWare: Middleware;
    components: Array<Instantiable<any>>;
    modules: Array<Instantiable<any>>;
    providers: Array<Instantiable<any>>;
}

/**
 * @hidden
 */
export const moduleStore: Map<string, ModuleStore> = new Map();
