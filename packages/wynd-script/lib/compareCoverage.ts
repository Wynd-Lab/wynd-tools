import axios from 'axios';
import path from 'path';
import { __prepareScript } from './__index';
import { CoverageSummary } from './interfaces';

const API_TOKEN = process.env.GITLAB_API_READ_ONLY_TOKEN;
const CI_API_URL = process.env.CI_API_URL;
const CI_PROJECT_ID = process.env.CI_PROJECT_ID;
const REF = global.__WSC.ref;
const THRESHOLD = global.__WSC.threshold;

async function main(): Promise<void> {
    __prepareScript('compareCoverage', () => {
        console.warn('Graceful shutdown.');
        process.exit(1);
        return;
    });

    if (!API_TOKEN || !CI_API_URL || !CI_PROJECT_ID) {
        console.warn(
            `Aborting compareCoverage cause an gitlab var is not defined: GITLAB_API_READ_ONLY_TOKEN: ${API_TOKEN}, CI_API_URL: ${CI_API_URL}, CI_PROJECT_ID: ${CI_PROJECT_ID}`,
        );
        process.exit(1);
        return;
    }

    if (!(await compareCoverage())) {
        console.warn('Aborting compareCoverage...');
        process.exit(1);
        return;
    }
}

async function compareCoverage(): Promise<boolean> {
    try {
        let coverage: CoverageSummary;
        try {
            coverage = await require(path.resolve(process.cwd(), './coverage/coverage-summary.json'));
        } catch (e) {
            console.error('Coverage report was not found.');
            return false;
        }

        const pipelines = (await axios.get(
            `${CI_API_URL}/projects/${CI_PROJECT_ID}/pipelines?private_token=${API_TOKEN}&ref=${REF}`,
        )).data;

        const lastRefBranchPipeLineSuccess = pipelines.find(elm => elm.status === 'success');

        if (!lastRefBranchPipeLineSuccess) {
            console.error('Last pipeline on develop was failed or not found.');
            return false;
        }

        const lastPipelineId = lastRefBranchPipeLineSuccess.id;
        const pipeline = (await axios.get(
            `${CI_API_URL}/projects/${CI_PROJECT_ID}/pipelines/${lastPipelineId}?private_token=${API_TOKEN}`,
        )).data;

        const refCoverage = parseFloat(pipeline.coverage);

        const currentCoverage =
            (coverage.total.lines.pct +
                coverage.total.statements.pct +
                coverage.total.functions.pct +
                coverage.total.branches.pct) /
            4;

        const roundedCurrentCoverage = Math.round(currentCoverage * 100) / 100;

        const delta = refCoverage - roundedCurrentCoverage;

        if (delta > THRESHOLD) {
            console.error(`Your delta of coverage with ${REF} is too damn high. \n
                Threshold: ${THRESHOLD}%\n
                Current: ${roundedCurrentCoverage}%\n
                ${REF}: ${refCoverage}%\n
                Delta: ${delta}%\n
                Minimum allowed: ${refCoverage - refCoverage}%`);
            return false;
        }

        console.info('== Coverage comparison passed ! ==');
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

main();
