import { __prepareScript, finish, packageFile as pfile } from './__index';

const packageFile = pfile;

// const MONOREPO = global.__WSC.monorepo; // TODO

__prepareScript('SyncPeerDev');
async function main() {
    let write = false;
    const peerDeps = packageFile.peerDependencies;
    const devDeps = packageFile.devDependencies || {};
    if (peerDeps) {
        Object.keys(peerDeps).forEach(dep => {
            if (peerDeps[dep] && peerDeps[dep] !== devDeps[dep]) {
                write = true;
                console.log(`📦  ${dep}: "${devDeps[dep]}"`);
                peerDeps[dep] = devDeps[dep];
            }
        });
    }

    if (write) {
        finish(packageFile);
    } else {
        console.info('No sync to do.');
    }
}

main();
