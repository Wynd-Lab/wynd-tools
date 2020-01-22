import { HookName } from './interfaces/HookName';

export default class HookException extends Error {
    constructor(public hookType: HookName, message?: string) {
        super(message);
    }
}
