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
    route: '/api'
})
class TestComponent {
    constructor(public foo: TestInjectable) { }

    @Endpoint('/foo/:id')
    test1(request: Request, response: Response) {
        this.foo.doStuff('foo');
        //console.log(this);
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }

    @Endpoint('/foo/:id')
    test2(request: Request, response: Response) {
        this.foo.doStuff('foo');
        //console.log(this);
        response
            .status(200)
            .json({foo: 'bar'})
            .send();
    }

    @Endpoint('/foo2/:id')
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
    components: [TestComponent]
})
class Test {

}







