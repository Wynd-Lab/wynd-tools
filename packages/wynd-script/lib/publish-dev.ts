import child_process from 'child_process';
import semver from 'semver';
import { __prepareScript, build, packageFile, publish, rollback, writePackageJson } from './__index';

function main(): void {
    const originalVersion = packageFile.version;

    __prepareScript('publish@next', () => {
        rollback();
        console.warn('Gracefull shutdown.');
        process.exit();
        return;
    });

    const remoteVersion = getRemoteVersion();
    if (!remoteVersion) {
        console.warn('Aborting.');
        process.exit(1);
        return;
    }
    console.info(`Remote version is ${remoteVersion}`);
    const newDevVersion = semver.inc(
        remoteVersion && semver.valid(remoteVersion) ? remoteVersion : originalVersion,
        'prerelease',
        false,
        'dev',
    );

    for (const script of ['install', 'upgrade']) {
        delete packageFile.scripts[`pre${script}`];
        delete packageFile.scripts[`post${script}`];
    }

    if (!writeNewVersion(newDevVersion)) {
        console.warn('Aborting. Please check you package.json, and clean it if needed with git.');
        process.exit(1);
        return;
    }

    if (!build()) {
        rollback();
        console.warn('Aborting. No publish has been done yet, but you maybe need to clean your build folder.');
        process.exit(1);
        return;
    }

    if (!publish(true)) {
        rollback();
        console.warn('Aborting. Please clean your build folder and check your package.json file.');
        process.exit(1);
        return;
    }
    rollback();
}

/**
 * e.g.
 * (1) if latest@v1.0.0 and next@v0.0.7-dev.4 ; returns latest
 * (2) if next is null ; returns latest
 * (3) if latest@v1.0.0 and next@v1.0.0-dev.3 ; return next
 * (4) if latest@v1.0.0 and next@v1.0.1-dev.0 ; return next
 */
function getRemoteVersion(): string | false {
    try {
        console.info(`Fetching ${packageFile.name} remote version...`);
        let remoteNextVersion = '',
            remoteLatestVersion = '';
        try {
            remoteNextVersion = child_process.execSync(`npm v ${packageFile.name}@next version`).toString();
            console.info(`@next version => v${remoteNextVersion}`);
        } catch {
            console.info('No @next version found.');
            remoteNextVersion = '';
        }
        try {
            remoteLatestVersion = child_process.execSync(`npm v ${packageFile.name}@latest version`).toString();
            if (!remoteLatestVersion.trim()) {
                throw new Error();
            }
            console.info(`@latest version => v${remoteLatestVersion}`);
        } catch {
            console.info('No @latest version found. Fallback on current local version.');
            remoteLatestVersion = packageFile.version;
        }

        // (2)
        if (!remoteNextVersion.trim()) {
            return remoteLatestVersion.trim();
        }

        const baseNextVersion = semver.valid(semver.coerce(remoteNextVersion));
        // (1)
        if (semver.gt(remoteLatestVersion, baseNextVersion)) {
            return remoteLatestVersion.trim();
        }
        // (3) (4)
        return remoteNextVersion.trim();
    } catch (e) {
        console.error('Error during remote version fetching.', e);
        return false;
    }
}

function writeNewVersion(version: string): boolean {
    packageFile.version = version;
    console.info('Rewriting new version into package.json...');

    return writePackageJson(packageFile);
}

main();
