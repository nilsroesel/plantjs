/**
 * @module Http
 */
import { IncomingHttpHeaders, IncomingMessage } from 'http';

/**
 * A simple facade for the node http IncomingMessage
 */
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

    /**
     * The request url
     */
    readonly url: string;
    /**
     * The request url params
     * Will add key and values for the route specific defined parameters (e.g. /:id)
     */
    readonly params: Object;
    /**
     * The http headers
     */
    readonly headers: IncomingHttpHeaders;
    /**
     * The http method
     */
    readonly method: string;
    /**
     * The http body
     */
    readonly body: string;

    constructor(request: IncomingMessage, body: string, params: Object) {
        this.url = request.url;
        this.params = params;
        this.headers = request.headers;
        this.method = request.method;
        this.body = body;
    }

    /**
     * Returns the http body as object
     */
    json(): Object {
        try {
            return JSON.parse(this.body);
        } catch (e) {
            return {};
        }
    }

}
