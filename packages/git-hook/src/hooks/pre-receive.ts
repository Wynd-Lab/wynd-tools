import getNewCommitsList from '../git/GetNewCommitsList';
import Hook from '../Hook';
import HookException from '../HookException';

class PreReceiveHookException extends HookException {
    constructor(message?: string) {
        super('pre-receive', message);
    }
}

export interface PreReceiveHookConfig {
    validPrefixes?: RegExp[];
    validPattern?: RegExp;
    commitAuthorEmailDomain?: string;
}

export default class PreReceiveHook extends Hook {
    public config!: PreReceiveHookConfig;

    public async run() {
        // Validate only new branches
        if (!this.isNewBranch()) {
            return;
        }

        // Validate prefix
        if (!this.hasValidBranchPrefix()) {
            throw new PreReceiveHookException(
                `Branch prefix is not valid.\nShould respect\n${this.config
                    .validPrefixes!.map(r => r.toString().replace('/^refs\\/heads\\/', ''))
                    .join('\n')}`,
            );
        }

        // Validate pattern
        if (!this.hasValidPattern()) {
            throw new PreReceiveHookException(
                `Branch name should match pattern ${this.config
                    .validPattern!.toString()
                    .replace('/^refs\\/heads\\/', '')}`,
            );
        }

        // Validate commits author email domain
        if (!(await this.hasValidAuthors())) {
            throw new PreReceiveHookException(
                `Invalid commit(s) author ! you need to commit with your ${this.config.commitAuthorEmailDomain} email`,
            );
        }
    }

    /**
     * Test if branch match pattern.
     */
    public hasValidPattern() {
        const { validPattern } = this.config;
        return !validPattern || validPattern.test(this.refName);
    }

    /**
     * Test if the branch respect what we want to valid.
     */
    public hasValidBranchPrefix() {
        const { validPrefixes } = this.config;
        return !validPrefixes || !validPrefixes.length || validPrefixes.some(r => r.test(this.refName));
    }

    /**
     * Test if the commit emails match the domain.
     */
    public async hasValidAuthors() {
        const { commitAuthorEmailDomain } = this.config;
        if (!commitAuthorEmailDomain) {
            return true;
        }

        const commitList = await getNewCommitsList(this.newRev);

        return commitList.every(
            ({ committerEmailDomain, authorEmailDomain }) =>
                committerEmailDomain === commitAuthorEmailDomain && authorEmailDomain === commitAuthorEmailDomain,
        );
    }
}
