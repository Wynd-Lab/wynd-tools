import { Hook } from './Hook';
import { HookException } from './HookException';

export type ClientHookName =
    | 'applypatch-msg'
    | 'commit-msg'
    | 'pre-commit'
    | 'pre-push'
    | 'pre-rebase'
    | 'prepare-commit-message';
export type ServerHookName = 'pre-receive' | 'post-receive' | 'pre-update' | 'update' | 'post-update';

export type HookName = ClientHookName | ServerHookName;

export async function hook(name: HookName) {
    try {
        const hookPath = `./${name}.js`;
        const hookObj: Hook = new (await import(hookPath)).default();
        await hookObj.run();
    } catch (e) {
        if (e instanceof HookException) {
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
}
