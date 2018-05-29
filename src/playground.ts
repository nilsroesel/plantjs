import { Application } from './decorators/application.decorator';
import { Endpoint } from './decorators/endpoint.decorator';
import { Component } from './decorators/component.decorator';
import { Response } from './util/wrapper/response.wrapper';
import { Request } from './util/wrapper/request.wrapper';
import { Injectable } from './decorators/injectable.decorator';
import { Injector } from './util';

@Injectable()
class TestInjectable {
    private bar;

    constructor() {
        this.bar = 'bar'
    }

    doStuff(logger?: string) { console.log(logger || 'I am from an injectable')}
}

@Component({
    route: '/api',
    middleware: [
        (request: Request, response: Response) => { console.log('Iam a Component Scope Middleware')}
    ]
})
class TestComponent {
    constructor(public foo: TestInjectable) { }

    @Endpoint({
        route: '/foo/:id'
    })
    test1(request: Request, response: Response) {
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }

    @Endpoint({
        route: '/foo/:id',
        middleware: [
            (request: Request, response: Response, next: Function) => {
                console.log(request.params);
                next();
                console.log('should be hidden');
            },
            (request: Request, response: Response) => { console.log('i should be displayed after the logged params')}
        ]
    })
    test2(request: Request, response: Response) {
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }

    @Endpoint({
        route: '/foo2/:id'
    })
    test3(request: Request, response: Response) {
        this.foo.doStuff('foo');
        //console.log(this);
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }

    /*@Endpoint('/foo/:id')
    test4(request: Request, response: string) {
        this.foo.doStuff('foo');
        //console.log(this);
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }*/
}

@Application({
    contentType: 'application/json',
    server: {
        port: 3000,
        maxConnections: 10,
        timeout: 500,
        keepAliveTimeout: 500
    },
    components: [TestComponent],
    middleware: [
        (request: Request, response: Response) => { console.log('Iam a application Scope Middleware')}
    ]
})
class Test {

}

/*/ Fn List workaround
const fnArray: Array<Function> = [() => console.log(1), (req, res, next) =>{ console.log(2); next(); console.log(3)}, () => console.log(4)];
const overriden: Array<Function> = fnArray
    .map(fn => new Function('req', 'res', 'next',`(${fn.toString().replace(/next\w*\(\w*\)/,'return next()')})(req, res, next)`));

const itr = overriden[Symbol.iterator]();
let done = false;
let updateItr = true;

while(!done) {
    const itrStep = nextIterator(itr);
    //if(itrStep.value) itrStep.value('req', 'res', () => { nextIterator(itr)});
    done = itrStep.done
}

function nextIterator(iterator: Iterator<Function>): IteratorResult<Function>{
    const itrStep = itr.next();
    if(itrStep.value) itrStep.value('req', 'res', () => { nextIterator(itr)});
    return itrStep;
}
*/
