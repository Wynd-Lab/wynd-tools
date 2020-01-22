import fs from 'fs';

export default abstract class Hook {
    public static readonly ZERO_COMMIT = '0000000000000000000000000000000000000000';

    public readonly config: object;
    public readonly oldRev: string;
    public readonly newRev: string;
    public readonly refName: string;

    constructor(config: object) {
        this.config = config;
        [this.oldRev, this.newRev, this.refName] = fs
            .readFileSync(0 as any, 'utf-8')
            .toString()
            .replace('\n', '')
            .split(' ');
    }

    /**
     * Run the hook.
     */
    public abstract async run(): Promise<void>;

    /**
     * Ensure that only new branches are tested. Because of this, tag are not blocked.
     */
    public isNewBranch() {
        return this.oldRev === Hook.ZERO_COMMIT && /^refs\/heads\//i.test(this.refName);
    }
}
