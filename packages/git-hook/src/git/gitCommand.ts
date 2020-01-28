import { exec } from 'child_process';

export default (command: string): Promise<string> =>
    new Promise((res, rej) => exec(`git ${command}`, (err, stdout, stderr) => (err ? rej(stderr) : res(stdout))));
