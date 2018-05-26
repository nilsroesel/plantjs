import { HandlerFn } from '../index';

export function Endpoint(route?: string) {
    return (target: Object, key: string | symbol) => {
        if (target['skeidjs'] && target['skeidjs'] instanceof Array && target[key] === Function) {
            (target['skeidjs'] as Array<SubComponent>).push({function: target[key], route: route || ''});
        }
        else {
            target['skeidjs'] = new Array<SubComponent>();
            (target['skeidjs'] as Array<SubComponent>).push({function: target[key], route: route || ''});
        }
    };
}

export interface SubComponent {
    function: HandlerFn;
    route: string;
}
