/**
 * @module Http
 */
import { ServerResponse } from 'http';

export class ServerEventDispatcher {

    private readonly connection: ServerResponse;

    constructor(connection: ServerResponse) { this.connection = connection; }

    /**
     * Dispatch a sever-sent-event on the depending connection.
     * Will throw an error if connection is closed
     * @param name Name of the dispatched event
     * @param payload Payload of the dispatched event
     * @param id Optional id of the dispatched event
     */
    dispatch<T>(name: string, payload: T, id?: number) {
        const message = 'event:'
            .concat(name)
            .concat('\n')
            .concat(id? `id:${id}\n` : '')
            .concat(`data: ${JSON.stringify(payload)}`)
            .concat('\n\n');
        this.connection.write(message);
    }
}
