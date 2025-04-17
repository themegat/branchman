import * as vscode from 'vscode';
import attachGitBranchListener from './function/branch_listener.function';
import initialiseGitBranch from './function/branch_initialiser.function';
import registerUpdateChildBranch from './command/update_child_branch.command';
import registerSetBranchState from './command/set_branch_state.command';
import registerShowBranchState from './command/show_branch_state.command';

export let context: vscode.ExtensionContext;

export function activate(ctx: vscode.ExtensionContext) {
	context = ctx;
	// Log activation
	console.log('Branch Man is activated');

	// Register commands
	ctx.subscriptions.push(registerUpdateChildBranch(ctx));
	ctx.subscriptions.push(registerSetBranchState(ctx));
	ctx.subscriptions.push(registerShowBranchState(ctx));

	initialiseGitBranch(ctx);

	const gitBranchListener = attachGitBranchListener(ctx);
	if (gitBranchListener) {
		context.subscriptions.push(gitBranchListener);
	}

	return {
		context
	};
}

// Deactivate the extension
export function deactivate() { }