import child_process from 'child_process';
import { __prepareScript, packageFile, rewritePackage, rollback } from './__index';

function main() {
    __prepareScript('pack', () => {
        rollback();
        console.warn('Gracefull shutdown.');
        process.exit();
        return;
    });

    if (!rewritePackage(packageFile)) {
        rollback();
        console.warn('Aborting. Please check you package.json, and clean it if needed with git.');
        process.exit(1);
        return;
    }

    if (!pack()) {
        rollback();
        console.warn('Aborting. No publish has been done yet, but you maybe need to clean your build folder.');
        process.exit(1);
        return;
    }
    rollback();
}

function pack(): boolean {
    try {
        console.info(`Packing ${packageFile.name}...`);
        child_process.execSync('npm pack', {
            stdio: [0, 1, 2],
        });
        console.info(`${packageFile.name} packed!`);
        return true;
    } catch (e) {
        console.error('Error during packing.', e);
        return false;
    }
}

main();
