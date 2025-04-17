import * as vscode from 'vscode';
import { exec } from 'child_process';

const updateChildBranch = (folder: vscode.WorkspaceFolder, branch: string) => {
    const folderPath = folder.uri.fsPath;

    const command = `git pull origin ${branch}`;

    exec(command, { cwd: folderPath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running git pull: ${error.message}`);
            vscode.window.showErrorMessage(`Error running git pull: ${error.message}`);
            return;
        }

        const message = `${stderr} \n ${stdout}`;
        const messageHeader = "Branch Man - Git Pull";
        const messageOptions: vscode.MessageOptions = {
            detail: message,
            modal: true,
        };
        console.log(`Git pull: ${message}`);
        vscode.window.showInformationMessage(messageHeader, messageOptions);
    });
};

export default updateChildBranch;