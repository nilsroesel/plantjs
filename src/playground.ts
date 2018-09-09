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
import * as path from 'path';

@Injectable(InjectionModes.SINGLE_INSTANCE)
class TestInjectable {
    public bar;

    constructor() {
        this.bar = 'bar'
    }

    doStuff(logger?: string) { console.log(logger || 'I am from an injectable')}
}

@Injectable()
class FileService {
    getBinaryFile() {
        let filePath = path.resolve('./playground-data/kav.png');
        let file = fs.readFileSync(filePath, 'binary');
        let size = fs.statSync(filePath).size;
        return {file, size}
    }

    getFileStream() {
        let filePath = path.resolve('./playground-data/auld-lang-syne.mp4');
        let file = fs.createReadStream(filePath);
        let size = fs.statSync(filePath).size;
        return {file, size}
    }
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

@Component({})
class FileEndpoints {
    constructor(private fileService: FileService) {
    }

    @Endpoint({
        route: '/file'
    })
    getStaticFile(request: Request, response: Response) {
        const file = this.fileService.getBinaryFile();
        response.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': file.size,
            'Accept-Ranges': 'bytes',
            'Content-Disposition': 'attachment; filename=your_file_name.png'
        });
        response.binary(file.file);
    }

    @Endpoint({
        route: '/video'
    })
    streamFile(request: Request, response: Response) {
        const file = this.fileService.getFileStream();
        response.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Length': file.size,
            'Content-Disposition': 'attachment; filename=your_file_name.mp4'
        });
        response.stream(file.file);
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
    components: [TestComponent, FileEndpoints, MicroComponent],
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

    @Endpoint({
        route: '/new'
    })
    test2(request: Request, response: Response) {
        const promise = new Promise(((resolve, reject) => reject('you are dumb')));
        response.respond(promise);
    }
}
