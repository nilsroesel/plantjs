/**
 * @module Non-exported
 */
import {
    Application,
    Endpoint,
    Component,
    Response,
    Request,
    Injectable,
    InjectionModes

} from './index'; // 'skeidjs'

@Injectable(InjectionModes.SINGLE_INSTANCE)
class TestInjectable {
    public bar;

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
    constructor(public foo: TestInjectable, public bar: TestInjectable) { }

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
        this.foo.bar = 'foobar';
        response
            .status(200)
            .json({foo: this.foo, bar: this.bar})
            .send();
    }

    @Endpoint({
        route: '/foo2/:id',
        middleware: [(request: Request) => {request.params['test'] = {msg: 'I come from a middle..where?'}}]
    })
    test3(request: Request, response: Response) {
        response
            .status(200)
            .json(Object.assign({}, this.foo, (request.params as any).test))
            .send();
    }

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
