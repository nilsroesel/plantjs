import { Instantiable, GenericClassDecorator } from '../index';

export function Injectable(): GenericClassDecorator<Instantiable<object>> {
    return (target: Instantiable<object>) => {
        // do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
    };
}
