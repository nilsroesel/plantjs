import 'reflect-metadata';
import { Request, Response } from '../index';

export function Endpoint(route?: string) {
    function checkEndpointIndexSignature(target: Object, key: string) {
        const types = Reflect.getMetadata('design:paramtypes', target, key) || [null, null];
        if (types[0] !== Request || types[1] !== Response || types.length !== 2) {
            const errorMessage = `Index signature of ${key}(${types.map(a => a.name).join()}) does not fit (req Request, res Response) => void`;
            throw new Error(errorMessage);
        }
    }
    return (target: Object, key: string) => {
        checkEndpointIndexSignature(target, key);
        if (target['skeidjs'] && target['skeidjs'] instanceof Array) {
            (target['skeidjs'] as Array<EndpointHandler>).push({
                functionInstance: target,
                functionKey: key,
                route: route || ''
            });
        }
        else {
            target['skeidjs'] = new Array<EndpointHandler>();
            (target['skeidjs'] as Array<EndpointHandler>).push({
                functionInstance: target,
                functionKey: key,
                route: route || ''
            });
        }
    };
}

export interface EndpointHandler {
    functionInstance: Object;
    functionKey: string;
    route: string;
}
