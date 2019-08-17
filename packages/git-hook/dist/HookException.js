"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HookException extends Error {
    constructor(hookType, message) {
        super(message);
        this.hookType = hookType;
    }
}
exports.HookException = HookException;
//# sourceMappingURL=HookException.js.map