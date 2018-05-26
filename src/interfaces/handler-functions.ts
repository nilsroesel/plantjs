import { Request } from '../util/wrapper/request.wrapper';
import { Response } from '../util/wrapper/response.wrapper';

export type HandlerFn = (request: Request, response: Response) => void;
