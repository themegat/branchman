
import * as vscode from 'vscode';
import pickWorkspaceFolder from '../util/workspace_picker';
import { BranchState } from '../model/branch_state';
import pickBranch from '../util/branch_picker';

const registerSetBranchState = (context: vscode.ExtensionContext): vscode.Disposable => {
    return vscode.commands.registerCommand('branchman.set-branch-state', () => {
        pickWorkspaceFolder().then(folder => {
            if (folder) {
                const branchState = context.workspaceState.get<BranchState>(folder.name) ?? { currentBranch: '' };
                const branchOptions = ['Current', 'Parent'];
                vscode.window.showQuickPick(branchOptions, { placeHolder: 'Select branch state to set' }).then(selectedOption => {
                    if (selectedOption) {
                        pickBranch(folder).then(branch => {
                            if (branch) {
                                switch (selectedOption) {
                                    case 'Current':
                                        branchState.currentBranch = branch;
                                        break;
                                    case 'Parent':
                                        branchState.parentBranch = branch;
                                        break;
                                }

                                context.workspaceState.update(folder.name, branchState);
                                vscode.window.showInformationMessage(`Updated the ${selectedOption.toLowerCase()} branch to '${branch}', for ${folder.name}`);
                            }
                        }).catch(error => {
                            console.error(error);
                            vscode.window.showErrorMessage(error.message);
                        });
                    }
                });
            }
        });
    });
};

export default registerSetBranchState;