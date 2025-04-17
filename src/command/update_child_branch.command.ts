
import * as vscode from 'vscode';
import updateChildBranch from '../function/update_child_branch.function';
import { BranchState } from '../model/branch_state';
import pickWorkspaceFolder from '../util/workspace_picker';

const registerUpdateChildBranch = (context: vscode.ExtensionContext): vscode.Disposable => {
    const setBranchStateMessage = 'Set the branch state using the "Set Branch State" command.';
    return vscode.commands.registerCommand('branchman.update-child', () => {
        pickWorkspaceFolder().then(folder => {
            if (folder) {
                const branchState = context.workspaceState.get<BranchState>(folder.name);

                if (branchState) {
                    if (branchState.parentBranch) {
                        vscode.window.showInformationMessage(
                            `Pull changes from ${branchState.parentBranch} into ${branchState.currentBranch}?`,
                            'Yes',
                            'No'
                        ).then(result => {
                            if (result === 'Yes' && branchState?.parentBranch) {
                                updateChildBranch(folder, branchState.parentBranch);
                            }
                        });
                    } else {
                        vscode.window.showErrorMessage(`No parent branch found for ${folder.name}, ${setBranchStateMessage}`);
                    }
                } else {
                    vscode.window.showErrorMessage(`No branch state found for ${folder.name}. ${setBranchStateMessage}`);
                }
            }
        });
    });
}

export default registerUpdateChildBranch;