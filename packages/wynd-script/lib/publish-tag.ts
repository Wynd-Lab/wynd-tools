import child_process from 'child_process';
import semver from 'semver';
import { build, packageFile, publish, rollback, writePackageJson, __prepareScript } from './__index';

export function main(tag: 'next' | 'rc'): void {
    const originalVersion = packageFile.version;

    __prepareScript(`publish@${tag}`, () => {
        rollback();
        console.warn('Gracefull shutdown.');
        process.exit();
        return;
    });

    const remoteVersion = getRemoteVersion(tag);
    if (!remoteVersion) {
        console.warn('Aborting.');
        process.exit(1);
        return;
    }
    console.info(`Remote version is ${remoteVersion}`);
    const newTagVersion = semver.inc(
        remoteVersion && semver.valid(remoteVersion) ? remoteVersion : originalVersion,
        'prerelease',
        false,
        tag === 'next' ? 'dev' : 'rc',
    );

    if (packageFile.scripts) {
        for (const script of ['install', 'upgrade']) {
            delete packageFile.scripts[`pre${script}`];
            delete packageFile.scripts[`post${script}`];
        }
    }

    if (!writeNewVersion(newTagVersion!)) {
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

    if (!publish(tag)) {
        rollback();
        console.warn('Aborting. Please clean your build folder and check your package.json file.');
        process.exit(1);
        return;
    }
    rollback();
}

/**
 * e.g.
 * (1) if latest@v1.0.0 and tag@v0.0.7-dev.4 ; returns latest
 * (2) if tag is null ; returns latest
 * (3) if latest@v1.0.0 and tag@v1.0.0-dev.3 ; return tag
 * (4) if latest@v1.0.0 and tag@v1.0.1-dev.0 ; return tag
 */
function getRemoteVersion(tag: 'next' | 'rc'): string | false {
    try {
        console.info(`Fetching ${packageFile.name} remote version...`);
        let remoteTagVersion = '',
            remoteLatestVersion = '';
        try {
            remoteTagVersion = child_process.execSync(`npm v ${packageFile.name}@${tag} version`).toString();
            console.info(`@${tag} version => v${remoteTagVersion}`);
        } catch {
            console.info(`No @${tag} version found.`);
            remoteTagVersion = '';
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
        if (!remoteTagVersion.trim()) {
            return remoteLatestVersion.trim();
        }

        const baseTagVersion = semver.valid(semver.coerce(remoteTagVersion)!);
        // (1)
        if (semver.gt(remoteLatestVersion, baseTagVersion!)) {
            return remoteLatestVersion.trim();
        }
        // (3) (4)
        return remoteTagVersion.trim();
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
