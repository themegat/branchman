import { exec } from 'child_process';
import { error } from 'console';
import path from 'path';

export class TestUtility {
    static readonly TEST_TIMEOUT = 4000;
    static readonly DELAY = 2000;
    public static delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    public static runBashScript(scriptPath: string, scriptName: string, args?: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = `bash ${scriptName} ${args?.join(" ")}`;
            exec(command, { cwd: scriptPath }, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                } else if (stderr) {
                    resolve(`Stderr: ${stderr}`);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    };
    public static checkoutBranch(workspaceName: string, branchName: string): Promise<string> {
        const dir = process.cwd();
        const test = path.join(
            dir,
            "..",
            "..",
            "src",
            "test",
            "util"
        );
        return new Promise((resolve, reject) => {
            this.runBashScript(test, "checkout.sh", [workspaceName, branchName]).then(value => resolve(value))
                .catch(error => reject(error));
        });
    };
}
