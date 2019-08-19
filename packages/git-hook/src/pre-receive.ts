import { Hook } from './Hook';
import { HookException } from './HookException';

class PreReceiveHookException extends HookException {
    constructor(message?: string) {
        super('pre-receive', message);
    }
}

export default class PreReceiveHook extends Hook {
    private static readonly VALID = [
        /^refs\/heads\/develop$/,
        /^refs\/heads\/master$/,
        /^refs\/heads\/feature\/.+/,
        /^refs\/heads\/hotfix\/.+/,
        /^refs\/heads\/release\/.+/,
        /^refs\/heads\/archi\/.+/,
        /^refs\/heads\/test\/.+/,
        /^refs\/heads\/ci\/.+/,
    ];

    public async run() {
        if (this.isNewBranch()) {
            if (!this.isAlphaNumBranch()) {
                throw new PreReceiveHookException('Branch name should be lowercased and alphanumeric.');
            } else if (!this.isValidBranch()) {
                throw new PreReceiveHookException(
                    `Branch name is not valid.\nShould respect "${PreReceiveHook.VALID}".`,
                );
            }
        }
    }

    /**
     * Test if branch is only alpha numeric and lowercase.
     */
    public isAlphaNumBranch() {
        return /^refs\/heads\/[-a-z0-9_.\/]+$/.test(this.refName);
    }

    /**
     * Test if the branch respect what we want to valid.
     */
    public isValidBranch() {
        return PreReceiveHook.VALID.some(r => r.test(this.refName));
    }
}
