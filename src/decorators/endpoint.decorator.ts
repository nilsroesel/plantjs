import { HandlerFn } from '../index';

export function Endpoint(route?: string) {
    return (target: Object, key: string) => {
        if (target['skeidjs'] && target['skeidjs'] instanceof Array && target[key] === Function) {
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
