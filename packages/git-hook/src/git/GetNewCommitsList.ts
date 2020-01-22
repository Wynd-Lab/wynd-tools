import gitCommand from './GitCommand';

interface Commit {
    tree?: string;
    parent?: string;
    authorEmailDomain?: string;
    committerEmailDomain?: string;
}

function extractValue(str: string, reg: RegExp): string | undefined {
    const matches = reg.exec(str);

    if (!matches) {
        return;
    }

    return matches.pop();
}

async function parseCommit(rawCommit: string): Promise<Commit> {
    const rawParse = await gitCommand(`cat-file -p ${rawCommit}`);

    const [rawTree, rawParent, rawAuthor, rawCommitter] = rawParse.split('\n').map(c => c.trim());

    return {
        authorEmailDomain: extractValue(rawAuthor, /^author\s.*<.*@(.*)>.*$/),
        committerEmailDomain: extractValue(rawCommitter, /^committer\s.*<.*@(.*)>.*$/),
        parent: extractValue(rawParent, /^parent\s([a-z0-9]+)$/),
        tree: extractValue(rawTree, /^tree\s([a-z0-9]+)$/),
    };
}

export default async function getNewCommitsList(commit: string): Promise<Commit[]> {
    const rawCommits = await gitCommand(`rev-list ${commit} --not --all --reverse`);

    return Promise.all(
        rawCommits
            .split('\n')
            .map(c => c.trim())
            .filter(Boolean)
            .map(c => parseCommit(c)),
    );
}
