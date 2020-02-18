import Hook from './Hook';
import HookException from './HookException';
import PreReceiveHook, { PreReceiveHookConfig } from './hooks/pre-receive';
import { HookCtor } from './interfaces/HookCtor';
import { HookName } from './interfaces/HookName';

async function createHook(hookType: HookName | HookCtor, config: object) {
    switch (hookType) {
        case 'pre-receive':
            return new PreReceiveHook(config);
        default:
            if (typeof hookType === 'function') {
                return new hookType(config);
            }
            console.warn(`\nGit hook "${hookType}" is configured but not available.\n`);
            return process.exit(0);
    }
}

async function hook(hookType: 'pre-receive', config: PreReceiveHookConfig): Promise<void>;
async function hook(hookType: HookName | HookCtor, config: object): Promise<void>;
async function hook(hookType: HookName | HookCtor, config: object = {}): Promise<void> {
    try {
        const hookObj = await createHook(hookType, config);
        await hookObj.run();
    } catch (e) {
        if (e instanceof HookException) {
            console.error('');
            console.error(`Hook "${e.hookType}" failed.`);
            `Reason: ${e.message}`.split('\n').forEach(m => {
                console.error(`\x1b[31m${m}\x1b[0m`);
            });
            console.error('');
            return process.exit(1);
        }
        console.warn(`\nAn unexpected error occured ! Skip hook\n`);
        console.log(e);
        return process.exit(0);
    }
}

export * from './interfaces/Commit';
export * from './interfaces/HookCtor';
export * from './interfaces/HookName';
export { Hook, HookException };

export default hook;
