import * as vscode from 'vscode';
import * as path from 'path';
import { BranchState } from '../model/branch_state';

const initialiseGitBranch = (context: vscode.ExtensionContext) => {
    // Get the current branch for each workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        workspaceFolders.forEach((folder) => {
            const gitHeadPath = path.join(folder.uri.fsPath, '.git', 'HEAD');
            vscode.workspace.fs.readFile(vscode.Uri.file(gitHeadPath)).then((data) => {
                const headContent = data.toString();
                const branchMatch = headContent.match(/ref: refs\/heads\/(.+)/);
                if (branchMatch) {
                    const branchName = branchMatch[1];
                    console.log(`Current branch in folder "${folder.name}": ${branchName}`);
                    const branchState: BranchState = {
                        currentBranch: branchName,
                    };
                    context.workspaceState.update(folder.name, branchState);
                } else {
                    console.log(`Detached HEAD state detected in folder "${folder.name}".`);
                }
            });
        });
    } else {
        console.error('No workspace folders found.');
    }
};

export default initialiseGitBranch;