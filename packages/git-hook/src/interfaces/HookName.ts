export type ClientHookName =
    | 'applypatch-msg'
    | 'commit-msg'
    | 'pre-commit'
    | 'pre-push'
    | 'pre-rebase'
    | 'prepare-commit-message';

export type ServerHookName = 'pre-receive' | 'post-receive' | 'pre-update' | 'update' | 'post-update';

export type HookName = ClientHookName | ServerHookName;
