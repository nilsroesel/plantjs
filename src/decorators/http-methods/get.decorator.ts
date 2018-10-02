/**
 * @module Decorators
 */
import { EndpointConfig } from '../../interfaces';
import { EndpointFactory, EndpointTypes } from '../../internal.index';


/**
 * Property Decorator Function
 * Works basically like the @Endpoint decorator, but only GET requests will be mapped to it. this will
 * enable duplicate routes on different method types
 * **/
export function Get(config: EndpointConfig) {
    return EndpointFactory.generateEndpointLogic(config, EndpointTypes.GET);
}
