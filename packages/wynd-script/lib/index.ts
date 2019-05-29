import yargs from 'yargs';
const wscPackageJson = require('../package.json');

declare global {
    namespace NodeJS {
        interface Global {
            __WSC: CliArgs & { param?: string };
        }
    }
}

interface CliArgs {
    build?: boolean;
    monorepo?: boolean;
    npm?: boolean;
    package?: string;
    public?: boolean;
    ref?: string;
    threshold?: number;
    verbose?: boolean;
}

const scripts = {
    coverage: './coverageCalculateTotal.js',
    coverageCompare: './compareCoverage.js',
    diffTslint: './diffTslintRules.js',
    pack: './pack.js',
    pub: './publish.js',
    'pub:dev': './publish-dev.js',
    syncPeer: './sync-peerDev.js',
};

global.__WSC = {};

let y: yargs.Argv<CliArgs> = yargs.help();

y.usage(`Wynd Script v${wscPackageJson.version} usage - $0 <command> [option]`);
y.epilog(`For more information please got to ${wscPackageJson.homepage}`);

y.options({
    build: {
        boolean: true,
        default: true,
        description: '--no-build if build should be skipped',
    },
    monorepo: {
        boolean: true,
        default: false,
        description: 'Act on a monorepo under "packages/" folder.',
    },
    npm: {
        boolean: true,
        default: false,
        description: 'Use npm instead of yarn during publish',
    },
    package: {
        alias: 'p',
        default: './package.json',
        description: 'The package.json path',
        string: true,
    },
    public: {
        boolean: true,
        default: false,
        description: 'Publish with public access',
    },
    ref: {
        default: 'develop',
        description: 'The branch reference you want to compare',
        string: true,
    },
    threshold: {
        default: 0,
        description: 'The percent delta authorized between your ref branch and your current coverage',
        number: true,
    },
    verbose: {
        alias: 'v',
        boolean: true,
    },
});

for (const [cmd, script] of Object.entries(scripts)) {
    y = y.command(cmd, '', {}, (argv: yargs.Arguments<CliArgs>) => {
        global.__WSC.build = !!argv.build;
        global.__WSC.monorepo = !!argv.monorepo;
        global.__WSC.npm = argv.npm;
        global.__WSC.package = argv.package;
        global.__WSC.param = argv._[1] || '';
        global.__WSC.public = argv.public;
        global.__WSC.ref = argv.ref;
        global.__WSC.threshold = argv.threshold;
        global.__WSC.verbose = !!argv.verbose;
        require(script);
    });
}

const a = y.demandCommand().strict().argv;
if (!a._[0]) {
    y.showHelp();
}
