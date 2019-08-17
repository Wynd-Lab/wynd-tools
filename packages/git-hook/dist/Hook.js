"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Hook {
    constructor() {
        [this.oldRev, this.newRev, this.refName] = fs_1.default
            .readFileSync(0)
            .toString()
            .replace('\n', '')
            .split(' ');
    }
    /**
     * Ensure that only new branches are tested. Because of this, tag are not blocked.
     */
    isNewBranch() {
        return this.oldRev === Hook.ZERO_COMMIT && /^refs\/heads\//i.test(this.refName);
    }
}
Hook.ZERO_COMMIT = '0000000000000000000000000000000000000000';
exports.Hook = Hook;
//# sourceMappingURL=Hook.js.map