import { Application } from './decorators/application.decorator';
import { Endpoint } from './decorators/endpoint.decorator';
import { Component } from './decorators/component.decorator';
import { Response } from './util/wrapper/response.wrapper';
import { Request } from './util/wrapper/request.wrapper';

@Component({
    route: '/api'
})
class TestComponent {
    constructor() { }

    @Endpoint('/foo/:id')
    test2(request: Request, response: Response) {
        console.log('body:', request.body);
        console.log('params:', request.params);
        response
            .status(200)
            .json({foo: 'bar'})
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
    components: [TestComponent]
})
class Test {

}






