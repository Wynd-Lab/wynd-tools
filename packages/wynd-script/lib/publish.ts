import { __prepareScript, build, packageFile, publish, rewritePackage, rollback } from './__index';

function main(): void {
    __prepareScript('publish@latest', () => {
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

    if (!build()) {
        rollback();
        console.warn('Aborting. No publish has been done yet, but you maybe need to clean your build folder.');
        process.exit(1);
        return;
    }

    if (!publish()) {
        rollback();
        console.warn('Aborting. Please clean your build folder and check your package.json file.');
        process.exit(1);
        return;
    }
    rollback();
}

main();
