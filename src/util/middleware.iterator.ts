/**
 * @module Non-exported
 */
import { ContextHandlerFn, Middleware, Request, Response } from '../index';

/**
 * @hidden
 */
export class MiddlewareIterator {

    static exec(middleware: Middleware, request: Request, response: Response) {

        function nextIterator(iterator: Iterator<ContextHandlerFn>): IteratorResult<ContextHandlerFn> {
            const itrStep = iterator.next();
            if (itrStep.value) {
                itrStep
                    .value
                    .fn(request, response, () => { nextIterator(iterator); });
            }
            return itrStep;
        }

        const overridden: Array<ContextHandlerFn> = middleware
            .map(fn => {
                if (typeof fn === 'function') {
                    return {
                        functionContextInstance: {caller: fn},
                        fn
                    } as ContextHandlerFn;
                }
                else return fn as ContextHandlerFn;
            }).map((contextFn: ContextHandlerFn) => {
                const oldFunction = contextFn.fn;
                const newFunction = new Function('req', 'res', 'next',
                    `(${oldFunction.toString().replace(/next\w*\(\w*\)/, 'return next()')}).call(this, req, res, next)`)
                    .bind(contextFn.functionContextInstance);
                return {
                    functionContextInstance: contextFn.functionContextInstance,
                    fn: newFunction
                } as ContextHandlerFn;
            });

        const itr = overridden[Symbol.iterator]();

        let done = false;

        while (!done) {
            const itrStep = nextIterator(itr);
            done = itrStep.done
        }
    }
}