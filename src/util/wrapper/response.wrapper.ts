/**
 * @module Http
 */
import { ServerResponse } from 'http';
import { ErrorMessage } from '../../index'

/**
 * A simple facade for the node http ServerResponse
 */
export class Response {
    /**
     * @hidden
     */
    private response: ServerResponse;
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
     * @deprecated since 1.6. Use respond() instead
     * @param {Object} payload
     * @returns {Response}
     */
    json(payload: Object): Response {
        this.response.write(JSON.stringify(payload));
        return this;
    }

    /**
     * Writes a string to the response, but don't closes the stream
     * @deprecated since 1.6. Use respond() instead
     * @param {string} payload
     * @returns {Response}
     */
    text(payload: string): Response {
        this.response.write(payload);
        return this;
    }

    /**
     * Ends the response
     * @deprecated since 1.6. Use respond() instead
     */
    send(): void { this.response.end(); }

    /**
     * Since version 1.6 you will use this to respond.
     * You are now able to put in an promise (that you e.g. get from some database services)
     * and can respond with it.
     * On error it will respond with an error object that put the promise rejection reason as message
     * @param {string | Promise<Object> | Object} payload
     */
    respond(payload?: string | Promise<Object> | Object): void {
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

}
