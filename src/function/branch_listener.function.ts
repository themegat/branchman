import * as vscode from 'vscode';
import * as path from 'path';
import { BranchState } from '../model/branch_state';

const attachGitBranchListener = (context: vscode.ExtensionContext): vscode.Disposable | undefined => {
    // Get the workspace folders
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.error('No workspace folders found.');
        return;
    }

    // Array to hold all watchers
    const disposables: vscode.Disposable[] = [];

    // Iterate over each workspace folder
    workspaceFolders.forEach((folder) => {
        const projectRoot = folder.uri.fsPath;
        const gitHeadPath = path.join(projectRoot, '.git', 'HEAD');
        // Create a FileSystemWatcher for the .git/HEAD file
        const watcher = vscode.workspace.createFileSystemWatcher(gitHeadPath);

        // Handle the Created event (triggered when the file is recreated)
        watcher.onDidCreate((uri) => {
            console.log(`.git/HEAD file was recreated in folder: ${folder.name}`);
            handleBranchChange(folder.name, uri.fsPath);
        });

        // Handle the Changed event
        watcher.onDidChange((uri) => {
            console.log(`.git/HEAD file was changed in folder: ${folder.name}`);
            handleBranchChange(folder.name, uri.fsPath);
        });

        // Handle the Deleted event
        watcher.onDidDelete((uri) => {
            console.log(`.git/HEAD file was deleted in folder: ${folder.name}`);
        });

        // Add the watcher to the disposables array
        disposables.push(watcher);
    });

    // Function to handle branch changes
    const handleBranchChange = (folderName: string, headFilePath: string) => {
        const branchState = context.workspaceState.get<BranchState>(folderName);
        // Read the contents of the HEAD file to determine the current branch
        vscode.workspace.fs.readFile(vscode.Uri.file(headFilePath)).then(async (data) => {
            const headContent = data.toString();
            const branchMatch = headContent.match(/ref: refs\/heads\/(.+)/);
            if (branchMatch && branchState) {
                const branchName = branchMatch[1];
                const result = await vscode.window.showInformationMessage(
                    `Set branch ${branchState.currentBranch} as the parent for the current branch ${branchName} ?`,
                    'Yes',
                    'No'
                );

                if (result === 'Yes') {
                    branchState.parentBranch = branchState.currentBranch;
                } else {
                    branchState.parentBranch = undefined;
                }
                branchState.currentBranch = branchName;
                context.workspaceState.update(folderName, branchState);
            } else {
                console.log('Detached HEAD state detected.');
                vscode.window.showInformationMessage('Detached HEAD state detected.');
            }
        });
    }

    return vscode.Disposable.from(...disposables);
};

export default attachGitBranchListener;