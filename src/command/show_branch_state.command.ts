import * as vscode from 'vscode';
import { BranchState } from '../model/branch_state';

const registerShowBranchState = (context: vscode.ExtensionContext): vscode.Disposable => {
    return vscode.commands.registerCommand('branchman.show-branch-state', () => {
        const keys = context.workspaceState.keys();
        const branchStates: ({ folder: string } & BranchState)[] = [];
        
        for (let key of keys) {
            const branchState = context.workspaceState.get<BranchState>(key);
            if (branchState) {
                branchStates.push({ folder: key, ...branchState });
            }
        }


        const message = branchStates.map((branchState, index) => {
            return `Workspace folder: ${branchState.folder}  | Current Branch: ${branchState.currentBranch} 
                | Parent Branch: ${branchState.parentBranch}`;
        }).join('\n');
        const messageHeader = `Branch Man - Branch State${branchStates.length > 1 ? 's' : ''}`;
        const messageOptions: vscode.MessageOptions = {
            detail: message,
            modal: true,
        };
        console.log(`Branch States: ${message}`);
        vscode.window.showInformationMessage(messageHeader, messageOptions);
    });
};

export default registerShowBranchState;