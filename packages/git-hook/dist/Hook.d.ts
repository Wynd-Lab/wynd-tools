export declare abstract class Hook {
    static readonly ZERO_COMMIT = "0000000000000000000000000000000000000000";
    readonly oldRev: string;
    readonly newRev: string;
    readonly refName: string;
    constructor();
    /**
     * Run the hook.
     */
    abstract run(): Promise<void>;
    /**
     * Ensure that only new branches are tested. Because of this, tag are not blocked.
     */
    isNewBranch(): boolean;
}
