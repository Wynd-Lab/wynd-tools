import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

interface PackageJsonField {
    [entry: string]: string;
}

interface PackageJson {
    scripts?: PackageJsonField;
    dependencies?: PackageJsonField;
    devDependencies?: PackageJsonField;
    peerDependencies?: PackageJsonField;
    version: string;
    name: string;
}

if (!global.__WSC.package) {
    global.__WSC.package = './package.json';
}
export const packageFilePath = global.__WSC.package.startsWith('/')
    ? global.__WSC.package
    : path.resolve(process.cwd(), global.__WSC.package);

let packageFile: PackageJson = {} as any;
try {
    packageFile = require(packageFilePath);
} catch (e) {
    console.error(`Cannot resolve package json file: ${packageFilePath}`);
    process.exit(1);
}

export { packageFile };

const originalPackage = { ...packageFile };
const originalScripts = packageFile.scripts ? { ...packageFile.scripts } : undefined;

if (packageFile.scripts) {
    for (const script of ['install', 'upgrade']) {
        delete packageFile.scripts[`pre${script}`];
        delete packageFile.scripts[`post${script}`];
    }
}

let prepared = false;
let noBuildScript = false;
export function __prepareScript(scriptName = 'WyndScript', callbackExit: NodeJS.SignalsListener = () => {}) {
    if (prepared) {
        return;
    }
    prepared = true;

    const oldInfo = console.info;
    const oldLog = console.log;
    const oldWarn = console.warn;
    console.info = message => oldInfo(`\x1b[36m\x1b[2m[${scriptName}]\x1b[0m ${message}`);
    console.log = message => oldLog(`\x1b[36m\x1b[2m[${scriptName}]\x1b[0m ${message}`);
    console.warn = message => oldWarn(`\x1b[36m\x1b[2m[${scriptName}]\x1b[0m ${message}`);

    if (global.__WSC.build && (!packageFile.scripts || !packageFile.scripts['build'])) {
        console.warn(`'build' script not found in ${packageFilePath}`);
        noBuildScript = true;
    }

    if (process.platform === 'win32') {
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.on('SIGINT', () => process.emit('SIGINT', 'SIGINT'));
    }

    process.on('SIGINT', callbackExit);
}

export function build(): boolean {
    if (!global.__WSC.build) {
        console.info('--no-build detected, skip build.');
        return true;
    }

    if (noBuildScript) {
        console.info('Skip build.');
        return true;
    }

    try {
        console.info(`Building ${packageFile.name}...`);
        child_process.execSync('yarn build', { stdio: [0, 1, 2] });
        console.info(`${packageFile.name} built!`);
        return true;
    } catch (e) {
        console.error('Error during building.', e);
        return false;
    }
}

export function publish(next = false) {
    const npm = global.__WSC.npm,
        isPublic = global.__WSC.public;
    try {
        const typeVersion = next ? 'next' : 'latest';
        console.info(`Publishing ${packageFile.name}@${typeVersion} version...`);
        npm &&
            console.warn(
                'In npm mode, when publishing a scoped package, npm will use ".npmrc" registry option before cli flag or "package.json" publishConfig object.',
            );
        isPublic && console.info('Publish with a public access.');
        child_process.execSync(
            `${npm ? 'npm' : 'yarn'} publish ${
                isPublic ? '--access public' : ''
            } --verbose --non-interactive --no-git-tag-version --tag ${typeVersion}`,
            {
                stdio: [0, 1, 2],
            },
        );
        console.info(`${packageFile.name} published!`);
        return true;
    } catch (e) {
        console.error('Error during publishing.', e);
        return false;
    }
}

export function rollback() {
    console.info('Rollbacking package.json file. To be sure you can also git reset.');

    return finish(originalPackage);
}

export function finish(p: typeof originalPackage) {
    originalScripts && (p.scripts = originalScripts);
    console.info('Rewriting new version into package.json...');

    return writePackageJson(p);
}

export function rewritePackage(p: typeof originalPackage) {
    console.info('Rewriting package.json to skip hook scripts...');

    return writePackageJson(p);
}

export function writePackageJson(p: typeof originalPackage) {
    try {
        fs.writeFileSync(path.resolve(__dirname, packageFilePath), `${JSON.stringify(p, undefined, 2)}\n`);
        console.info('Great success!');
        return true;
    } catch (e) {
        console.error('Error during package.json rewriting.', e);
        return false;
    }
}
