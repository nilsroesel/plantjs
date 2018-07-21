/**
 * @module Non-exported
 */
import {
    Application,
    Endpoint,
    Component,
    Injectable,
    InjectionModes,
    Module,
    Response,
    Request
} from './index'; // 'skeidjs'
import * as fs from 'fs';

@Injectable(InjectionModes.SINGLE_INSTANCE)
class TestInjectable {
    public bar;

    constructor() {
        this.bar = 'bar'
    }

    doStuff(logger?: string) { console.log(logger || 'I am from an injectable')}
}

@Component({})
class MicroComponent {
    constructor(public foo: TestInjectable) {}

    @Endpoint({
        route: '/test'
    })
    test1(request: Request, response: Response) {
        this.foo.bar = 'Hello World';
        response
            .status(200)
            .json(this.foo)
            .send();
    }
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

}

@Module({
    route: '/module',
    components: [MicroComponent]
})
class TestModule {}

@Application({
    contentType: 'application/json',
    server: {
        maxConnections: 10,
        timeout: 500,
        keepAliveTimeout: 500,
        https: {
            allowHttp: true,
            ca: fs.readFileSync('./playground-data/ca-crt.pem'),
            cert: fs.readFileSync('./playground-data/server-crt.pem'),
            key: fs.readFileSync('./playground-data/server-key.pem'),
            rejectUnauthorized: false,
            requestCert: false
        }
    },
    components: [TestComponent],
    middleware: [
        (request: Request, response: Response) => { console.log('Iam a application Scope Middleware')}
    ],
    modules: [TestModule]
})
class Test {

    @Endpoint({
        route: '/foo/:id#alpha',
        middleware: [(request: Request) => {request.params['test'] = {msg: 'I come from a middle..where?'}}]
    })
    test(request: Request, response: Response) {
        response
            .status(200)
            .json({msg: 'iam an application endpoint'})
            .send();
    }
}
