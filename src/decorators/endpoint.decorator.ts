import { HandlerFn } from '../index';

export function Endpoint(route?: string) {
    return (target: Object, key: string | symbol) => {
        if (target['plantjs'] && target['plantjs'] instanceof Array && target[key] === Function) {
            (target['plantjs'] as Array<SubComponent>).push({function: target[key], route: route || ''});
        }
        else {
            target['plantjs'] = new Array<SubComponent>();
            (target['plantjs'] as Array<SubComponent>).push({function: target[key], route: route || ''});
        }
    };
}

export interface SubComponent {
    function: HandlerFn;
    route: string;
}
