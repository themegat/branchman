import * as vscode from 'vscode';

const pickWorkspaceFolder = async (): Promise<vscode.WorkspaceFolder | undefined> => {
    return new Promise((resolve, reject) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folders found.');
            return;
        }

        // Let the user select a workspace folder
        const folderOptions = workspaceFolders.map(folder => folder.name);
        vscode.window.showQuickPick(folderOptions, { placeHolder: 'Select a workspace folder to run git pull' }).then(selectedFolder => {
            if (!selectedFolder) {
                reject();
            }

            const folder = workspaceFolders.find(folder => folder.name === selectedFolder);
            if (folder) {
                resolve(folder);
            }
        });
    });
};

export default pickWorkspaceFolder;