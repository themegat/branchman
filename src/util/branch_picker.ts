import { exec } from 'child_process';
import * as vscode from 'vscode';

const pickBranch = (folder: vscode.WorkspaceFolder): Promise<string | undefined> => {
    let command = "git branch --all";
    let outputLines: string[] = [];
    const folderPath = folder.uri.fsPath;

    return new Promise((resolve, reject) => {
        exec(command, { cwd: folderPath }, (error, stdout) => {
            if (error) {
                console.error(`Error running command - ${command}: ${error.message}`);
                reject(error);
                return;
            }

            outputLines = stdout.trim().split('\n')
                .map(line => line.trim().replace(/^\* /, ''))
                .filter(line => !line.startsWith('remotes/origin'));

            vscode.window.showQuickPick(outputLines, { placeHolder: 'Select a branch' }).then(selectedBranch => {
                if (selectedBranch) {
                    resolve(selectedBranch);
                }
            });
        });
    });
};

export default pickBranch;