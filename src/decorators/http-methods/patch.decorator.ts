/**
 * @module Decorators
 */
import { EndpointConfig } from '../../interfaces';
import { EndpointFactory, EndpointTypes } from '../../internal.index';


/**
 * Since 1.7
 * Property Decorator Function
 * Works basically like the @Endpoint decorator, but only PATCH requests will be mapped to it. this will
 * enable duplicate routes on different method types
 * **/
export function Patch(config: EndpointConfig) {
    return EndpointFactory.generateEndpointLogic(config, EndpointTypes.PATCH);
}
