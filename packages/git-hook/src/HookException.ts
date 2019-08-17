import { HookName } from '.';

export class HookException extends Error {
    constructor(public hookType: HookName, message?: string) {
        super(message);
    }
}
