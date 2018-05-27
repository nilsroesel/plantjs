import { Request, Response } from '../index';

export class Route {
    readonly functionInstance: Object;
    readonly functionKey: string;
    readonly params: Object;

    constructor(functionInstance: Object, functionKey: string, params: Object) {
        this.functionInstance = functionInstance;
        this.functionKey = functionKey;
        this.params = params;
    }

    call(request: Request, response: Response): void { this.functionInstance[this.functionKey](request, response); }
}
