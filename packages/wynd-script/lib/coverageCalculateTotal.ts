import path from 'path';
import { __prepareScript } from './__index';
import { CoverageSummary } from './interfaces';

async function main(): Promise<void> {
    __prepareScript('coverageTotalAverage', () => {
        console.warn('Graceful shutdown.');
        process.exit(1);
        return;
    });

    if (!(await coverageTotalAverage())) {
        console.warn('Aborting coverageTotalAverage...');
        process.exit(1);
        return;
    }
}

async function coverageTotalAverage(): Promise<boolean> {
    let coverage: CoverageSummary;
    try {
        try {
            coverage = await require(path.resolve(process.cwd(), './coverage/coverage-summary.json'));
        } catch (e) {
            console.error('Coverage report was not found.');
            return false;
        }

        const total =
            (coverage.total.lines.pct +
                coverage.total.statements.pct +
                coverage.total.functions.pct +
                coverage.total.branches.pct) /
            4;

        console.log(`TotalCoverage: ${total}%`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

main();
