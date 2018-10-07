/**
 * @module Http
 */
import { ServerResponse } from 'http';
import { Stream } from 'stream';
import { ErrorMessage, ServerEventDispatcher } from '../../index'

/**
 * A simple facade for the node http ServerResponse
 */
export class Response {
    /**
     * @hidden
     */
    private readonly response: ServerResponse;
    /**
     * @hidden
     */
    private statusCode: number;

    constructor(response: ServerResponse) { this.response = response; }

    /**
     * Sets a specific http response header
     * @param {string} name
     * @param {string | string[] | number} value
     * @returns {Response}
     */
    setHeader(name: string, value: string | string[] | number): Response {
        this.response.setHeader(name, value);
        return this;
    }

    /**
     * Set the whole http header at once ( node.http.ServerResponse.writeHead() )
     * @param {number} status
     * @param {...'header': value} headerObject
     * @returns {Response}
     */
    writeHead(status: number, headerObject: { [key: string]: any }): Response {
        this.response.writeHead(status, headerObject);
        return this;
    }

    /**
     * Sets the http status code
     * @param {number} status
     * @param {string} message
     * @returns {Response}
     */
    status(status: number, message?: string): Response {
        this.response.statusCode = status;
        if (message) this.response.statusMessage = message;
        return this;
    }

    /**
     * Writes json representation of the given object to the response, but don't closes the stream
     * @deprecated since 1.5.1 Use respond() instead
     * @param {Object} payload
     * @returns {Response}
     */
    json(payload: Object): Response {
        this.response.write(JSON.stringify(payload));
        return this;
    }

    /**
     * Writes a string to the response, but don't closes the stream
     * @deprecated since 1.5.1 Use respond() instead
     * @param {string} payload
     * @returns {Response}
     */
    text(payload: string): Response {
        this.response.write(payload);
        return this;
    }

    /**
     * Ends the response
     * @deprecated since 1.5.1 Use respond() instead
     */
    send(): void { this.response.end(); }

    /**
     * Since version 1.5.1 you will use this to respond.
     * You are now able to put in an promise (that you e.g. get from some database services)
     * and can respond with it.
     * On error it will respond with an error object that put the promise rejection reason as message
     * @param {string | Promise<Object> | Object} payload
     */
    respond(payload?: string | Promise<Object> | Stream | Object): void {
        if (!payload) this.response.end();
        else if (typeof payload === 'string') {
            this.response.write(payload);
            this.response.end();
        }
        else if (payload instanceof Promise) {
            payload
                .then(_payload => {
                    this.response.write(JSON.stringify(_payload));
                    this.response.end();
                })
                .catch(reason => {
                    this.status(500, reason);
                    this.response.write(JSON.stringify({status: 500, message: reason} as ErrorMessage));
                    this.response.end();
                });
        } else {
            this.response.write(JSON.stringify(payload));
            this.response.end();
        }
    }

    /**
     * Since version 1.6
     * Sends binary payload to the client (would work for downloading)
     * For displaying a video on a frontend use the stream() method
     * @param payload
     */
    binary(payload): void {
        this.response.write(payload, 'binary');
        this.response.end();
    }

    /**
     * Since version 1.6
     * Takes a file stream and pipes the response
     * Use this for serving things like music or videos e.g. for a web browser
     * @param {Stream} payload
     */
    stream(payload: Stream): void {
        payload.on('error', (err) => {
            this.status(500, err);
            this.response.write(JSON.stringify({status: 500, message: err} as ErrorMessage));
            this.response.end();
        });
        payload.on('open', () => payload.pipe(this.response));
    }

    /**
     * Since version 1.7
     * Acts as server sent event source
     * Use this for serving things like music or videos e.g. for a web browser
     * @param headers A headers object for additional headers
     */
    event(headers?: any): ServerEventDispatcher {
        delete (headers || {})['Connection'];
        delete (headers || {})['Content-Type'];
        delete (headers || {})['Cache-Control'];
        const header = Object.assign({}, {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }, headers);
        this.writeHead(200, header);

        return new ServerEventDispatcher(this.response);
    }

    /**
     * Since 1.8
     * If the response was ended this will return true
     * @return {boolean}
     */
    finished(): boolean {
        return this.response.finished
    }

    /**
     * Since 1.8
     * Ends the response
     * @param {(...args) => any} callback
     */
    end(callback?: (...args) => any) {
        this.response.end(callback);
    }


}
