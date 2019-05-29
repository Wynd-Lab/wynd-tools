export interface CoverageSummary {
    total: {
        lines: {
            pct: number;
            [P: string]: any;
        };
        statements: {
            pct: number;
            [P: string]: any;
        };
        functions: {
            pct: number;
            [P: string]: any;
        };
        branches: {
            pct: number;
            [P: string]: any;
        };
    };
}
