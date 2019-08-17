import { Hook } from './Hook';
export default class PreReceiveHook extends Hook {
    private static readonly VALID;
    run(): Promise<void>;
    /**
     * Test if branch is only alpha numeric and lowercase.
     */
    isAlphaNumBranch(): boolean;
    /**
     * Test if the branch respect what we want to valid.
     */
    isValidBranch(): boolean;
}
