"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hook_1 = require("./Hook");
const HookException_1 = require("./HookException");
class PreReceiveHookException extends HookException_1.HookException {
    constructor(message) {
        super('pre-receive', message);
    }
}
class PreReceiveHook extends Hook_1.Hook {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNewBranch()) {
                if (!this.isAlphaNumBranch()) {
                    throw new PreReceiveHookException('Branch name should be lowercased and alphanumeric.');
                }
                else if (!this.isValidBranch()) {
                    throw new PreReceiveHookException(`Branch name is not valid.\nShould respect "${PreReceiveHook.VALID}".`);
                }
            }
        });
    }
    /**
     * Test if branch is only alpha numeric and lowercase.
     */
    isAlphaNumBranch() {
        return /^refs\/heads\/[-a-z0-9_.\/]+$/.test(this.refName);
    }
    /**
     * Test if the branch respect what we want to valid.
     */
    isValidBranch() {
        return PreReceiveHook.VALID.some(r => r.test(this.refName));
    }
}
PreReceiveHook.VALID = [
    /^refs\/heads\/develop$/,
    /^refs\/heads\/master$/,
    /^refs\/heads\/feature\/.+/,
    /^refs\/heads\/hotfix\/.+/,
    /^refs\/heads\/release\/.+/,
    /^refs\/heads\/archi\/.+/,
];
exports.default = PreReceiveHook;
//# sourceMappingURL=pre-receive.js.map