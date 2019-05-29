import { __prepareScript, finish, packageFile as pfile } from './__index';

const packageFile: { peerDependencies?: any } & typeof pfile = pfile;

const MONOREPO = global.__WSC.monorepo; // TODO

__prepareScript('SyncPeerDev');
async function main() {
    let write = false;
    if (packageFile.peerDependencies) {
        Object.keys(packageFile.devDependencies).forEach(dep => {
            if (
                packageFile.peerDependencies[dep] &&
                packageFile.peerDependencies[dep] !== packageFile.devDependencies[dep]
            ) {
                write = true;
                console.log(`📦  ${dep}: "${packageFile.devDependencies[dep]}"`);
                packageFile.peerDependencies[dep] = packageFile.devDependencies[dep];
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
