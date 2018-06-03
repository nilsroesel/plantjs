/**
 * @module Http
 */
import { ServerResponse } from 'http';

export class Response {
    private response: ServerResponse;
    private statusCode: number;

    constructor(response: ServerResponse) {
        this.response = response;
    }

    setHeader(name: string, value: string | string[] | number): Response {
        this.response.setHeader(name, value);
        return this;
    }

    status(status: number, message?: string): Response {
        this.response.statusCode = status;
        if (message) this.response.statusMessage = message;
        return this;
    }

    text(payload: string): Response {
        this.response.write(payload);
        return this;
    }

    json(payload: Object): Response {
        this.response.write(JSON.stringify(payload));
        return this;
    }

    send(): void {
        this.response.end();
    }

}
