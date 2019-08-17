export declare type ClientHookName = 'applypatch-msg' | 'commit-msg' | 'pre-commit' | 'pre-push' | 'pre-rebase' | 'prepare-commit-message';
export declare type ServerHookName = 'pre-receive' | 'post-receive' | 'pre-update' | 'update' | 'post-update';
export declare type HookName = ClientHookName | ServerHookName;
export declare function hook(name: HookName): Promise<void>;
