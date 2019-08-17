"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const HookException_1 = require("./HookException");
function hook(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hookPath = `./${name}.js`;
            const hookObj = new (yield Promise.resolve().then(() => __importStar(require(hookPath)))).default();
            yield hookObj.run();
        }
        catch (e) {
            if (e instanceof HookException_1.HookException) {
                console.error(``);
                console.error(`Hook "${e.hookType}" failed.`);
                `Reason: ${e.message}`.split('\n').forEach(m => {
                    console.error(`\x1b[31m${m}\x1b[0m`);
                });
                console.error(``);
                return process.exit(1);
            }
            console.warn(`\nGit hook "${name}" is configured but not available.\n`);
            console.log(e);
            return process.exit(0);
        }
    });
}
exports.hook = hook;
//# sourceMappingURL=index.js.map