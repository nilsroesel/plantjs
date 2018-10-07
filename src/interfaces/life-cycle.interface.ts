/**
 * @module Lifecycle
 */

/**
 * When the application, a module or a component implements this this interface,
 * the function will be called after the instance was created.
 */
export interface OnInit {
    onInit(): void;
}

/**
 * Type guard for OnInit interface
 */
export function implementsOnInit(arg: any): arg is OnInit {
    return !!(arg || {}).onInit
}
