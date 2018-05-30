import { IncomingHttpHeaders, IncomingMessage } from 'http';

export class Request {
    static readRequestBody(request: IncomingMessage): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let body = [];
            request.on('error', (err) => {
                reject(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(body).toString());
            });
        });

    }

    readonly url: string;
    readonly params: Object;
    readonly headers: IncomingHttpHeaders;
    readonly method: string;
    readonly body: string;

    constructor(request: IncomingMessage, body: string, params: Object) {
        this.url = request.url;
        this.params = params;
        this.headers = request.headers;
        this.method = request.method;
        this.body = body;
    }

    json(): Object {
        try {
            return JSON.parse(this.body);
        } catch (e) {
            return {};
        }
    }

}
