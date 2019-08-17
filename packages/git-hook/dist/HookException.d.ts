import { HookName } from '.';
export declare class HookException extends Error {
    hookType: HookName;
    constructor(hookType: HookName, message?: string);
}
