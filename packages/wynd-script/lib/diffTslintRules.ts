import path from 'path';
import { __prepareScript } from './__index';

import { rules as tslintRules } from 'tslint/lib/configs/all';

interface TSLintRules {
    rules?: typeof tslintRules;
    extends?: string[] | string;
    rulesDirectory?: string[] | string;
}
interface RuleFound {
    where: string;
    equals: boolean;
    your?: string;
    their?: string;
}

const VERBOSE = global.__WSC.verbose;

__prepareScript('DiffTsLint');

if (!global.__WSC.param) {
    global.__WSC.param = './tslint.json';
}

const tslintFilePath = global.__WSC.param.startsWith('/')
    ? global.__WSC.param
    : path.resolve(process.cwd(), global.__WSC.param);
let tslintJson: TSLintRules;
try {
    tslintJson = require(tslintFilePath);
} catch {
    console.error(`Cannot load tslint file: ${tslintFilePath}`);
    process.exit(1);
}

const alreadyChecked: string[] = [];
const rulesFound: {
    [RULE_NAME: string]: RuleFound[];
} = {};
async function main() {
    console.log(`Check rules in ${tslintFilePath}. ✅  = You can safely delete this rule`);

    if (!Array.isArray(tslintJson.extends)) {
        tslintJson.extends = tslintJson.extends ? [tslintJson.extends] : [];
    }

    let rules: TSLintRules | undefined;
    for (const e of tslintJson.extends.reverse()) {
        rules = await getLibRules(e);
        rules && (await checkRules(rules, e));
    }

    for (const [ruleName, found] of Object.entries(rulesFound)) {
        console.info(`Rule \x1b[1m"${ruleName}"\x1b[0m: \x1b[31m${found[0].your}\x1b[0m`);
        let iteration = 1;
        found.forEach(f => {
            console.info(`    (x${iteration}) ${f.equals && iteration === 1 ? '✅ ' : ''}Found in \x1b[4m${f.where}\x1b[0m ${f.equals ? '' : 'but different:'}`); // tslint:disable-line
            if (!f.equals) {
                console.info(`        \x1b[33m${f.their}\x1b[0m`);
            }
            iteration++;
        });
    }
}

/**
 * @param e Extends lib name
 */
async function getLibRules(e: string, from: string = ''): Promise<TSLintRules | undefined> {
    if (e.includes('-plugin-')) {
        VERBOSE &&
            console.warn(
                `Rules contained in ${e} are ignored because of the maybe-plugin state of the lib. Please check them by yourself.`,
            );
        return;
    }

    if (e.startsWith('tslint:')) {
        const tslintType = e.split(':')[1];
        return import(`tslint/lib/configs/${tslintType}`);
    }
    if (e.startsWith('.')) {
        from = path.dirname(from);
        return import(path.resolve(from, e));
    }
    return import(e);
}

async function checkRules(r: TSLintRules, e: string) {
    if (alreadyChecked.includes(e)) {
        VERBOSE && console.log(`\x1b[1mSkip ${e} because it was already checked\x1b[0m`);
        return;
    }

    VERBOSE && console.log(`\x1b[1mDiff rules with ${e}\x1b[0m`);
    if (r.extends) {
        const extendsList =
            typeof r.extends === 'string' ? [r.extends] : r.extends.filter(sube => !alreadyChecked.includes(sube));
        let subRules: TSLintRules | undefined;

        let from = process.cwd();
        try {
            from = require.resolve(e);
        } catch {}
        for (const sube of extendsList.reverse()) {
            VERBOSE && console.log(`\x1b[1mSub extends ${sube}\x1b[0m`);
            subRules = await getLibRules(sube, from);
            subRules && (await checkRules(subRules, sube));
        }
    }

    const rules = r.rules;
    if (!rules) {
        return;
    }

    const isKeyOfRules = (rule: string, rulesMap: typeof tslintRules): rule is keyof typeof tslintRules => {
        return rule in rulesMap;
    };

    for (const rule in tslintJson.rules) {
        if (rule === 'prettier') {
            continue;
        }
        VERBOSE && console.log(`\x1b[2mCheck ${rule} ...\x1b[0m`);
        if (isKeyOfRules(rule, rules)) {
            rulesFound[rule] = rulesFound[rule] || [];
            let compare = rules[rule] === tslintJson.rules[rule];
            const ruleValue1 = rules[rule];
            const ruleValue2 = tslintJson.rules[rule];
            if (Array.isArray(ruleValue1)) {
                compare = Array.isArray(ruleValue2) && compareArrays(ruleValue1, ruleValue2);
            }

            if (compare) {
                rulesFound[rule].push({
                    equals: true,
                    where: e,
                    your: JSON.stringify(tslintJson.rules[rule]),
                });
            } else {
                rulesFound[rule].push({
                    equals: false,
                    their: JSON.stringify(rules[rule]),
                    where: e,
                    your: JSON.stringify(tslintJson.rules[rule]),
                });
            }
        }
    }
}

function compareArrays(array1: any[], array2: any[]) {
    return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index]);
}

main();
