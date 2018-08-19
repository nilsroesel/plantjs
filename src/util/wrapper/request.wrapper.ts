/**
 * @module Http
 */
import { IncomingHttpHeaders, IncomingMessage } from 'http';

const fs = require('fs');

/**
 * A simple facade for the node http IncomingMessage
 */
export class Request {
    static readRequestBody(request: IncomingMessage): Promise<{ body: string, binary: any }> {
        return new Promise<{ body: string, binary: any }>((resolve, reject) => {
            let body = [];
            request.on('error', (err) => {
                reject(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                resolve({body: Buffer.concat(body).toString(), binary: Buffer.concat(body)});
            }).on('close', () => {
                resolve({body: Buffer.concat(body).toString(), binary: Buffer.concat(body)});
            });
        });

    }

    private request: IncomingMessage;
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

    private readonly binary;

    constructor(request: IncomingMessage, body: string, binary: any, params: Object) {
        this.request = request;
        this.url = request.url;
        this.params = params;
        this.headers = request.headers;
        this.method = request.method;
        this.body = body;
        this.binary = binary;
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

    /**
     * Saves data to the given path
     * @param targetPath Path where the file should be saved
     */
    file(targetPath: string) {
        const file = fs.createWriteStream(targetPath);
        file.write(this.binary);
    }

}
