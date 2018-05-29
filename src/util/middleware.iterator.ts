import { ContextHandlerFn, Middleware, Request, Response } from '../index';

/**
 * @hidden
 */
export class MiddlewareIterator {

    static exec(middleware: Middleware, request: Request, response: Response) {

        function nextIterator(iterator: Iterator<ContextHandlerFn>): IteratorResult<ContextHandlerFn> {
            const itrStep = iterator.next();
            if (itrStep.value) itrStep.value.functionContextInstance[itrStep.value.functionKey](request, response, () => { nextIterator(iterator); });
            return itrStep;
        }

        const overridden: Array<ContextHandlerFn> = middleware
            .map(fn => {
                if (typeof fn === 'function') {
                    return {
                        functionContextInstance: {caller: fn},
                        functionKey: 'caller'
                    } as ContextHandlerFn;
                }
                else return fn as ContextHandlerFn;
            }).map((fn: ContextHandlerFn) => {
                const oldFunction = fn.functionContextInstance[fn.functionKey];
                const newFunction = new Function('req', 'res', 'next',
                    `(${oldFunction.toString().replace(/next\w*\(\w*\)/, 'return next()')})(req, res, next)`);
                const newContextInstance = Object.assign({}, fn.functionContextInstance);
                newContextInstance[fn.functionKey] = newFunction;
                return {functionContextInstance: newContextInstance, functionKey: fn.functionKey} as ContextHandlerFn;
            });

        const itr = overridden[Symbol.iterator]();

        let done = false;

        while (!done) {
            const itrStep = nextIterator(itr);
            done = itrStep.done
        }
    }
}