import * as assert from "assert";
import * as vscode from "vscode";
import { TestUtility } from "./util/test_utility";
import Sinon from "sinon";
import { BranchState } from "../model/branch_state";

let inputBox: Sinon.SinonStub;
let infoMessageDialog: Sinon.SinonStub;
let quickPick: Sinon.SinonStub;
let errorMessageDialog: Sinon.SinonStub;

const setUp = () => {
  inputBox = Sinon.stub(vscode.window, "showInputBox");
  infoMessageDialog = Sinon.stub(vscode.window, "showInformationMessage");
  quickPick = Sinon.stub(vscode.window, "showQuickPick");
  errorMessageDialog = Sinon.stub(vscode.window, "showErrorMessage");
};

const setUpWorkSpace = async () => {
  await Promise.all([
    TestUtility.checkoutBranch("workspace_one", "master"),
    TestUtility.checkoutBranch("workspace_two", "master"),
  ]);
};

const tearDown = () => {
  inputBox.restore();
  infoMessageDialog.restore();
  quickPick.restore();
  errorMessageDialog.restore();
  Sinon.restore();
};

suite("Branch Man Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  suite("Verify - Test Suite", () => {
    test("Verify - Sample test", () => {
      assert.strictEqual(-1, [1, 2, 3].indexOf(5));
      assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
  });

  suite("Show Branch State - Test Suite", () => {
    test("Show Branch State works", async () => {
      setUp();
      await setUpWorkSpace();

      await TestUtility.delay(TestUtility.DELAY * 2);
      await vscode.commands.executeCommand("branchman.show-branch-state");
      await TestUtility.delay(TestUtility.DELAY * 2);

      assert.equal(infoMessageDialog.called, true);
      const title = infoMessageDialog.args[2][0];
      const message = infoMessageDialog.args[2][1];
      assert.equal(title, "Branch Man - Branch States");
      const expectedMessage =
        "Workspace folder: workspace_one  | Current Branch: master \n| Parent Branch: undefined\nWorkspace folder: workspace_two  | Current Branch: master \n| Parent Branch: undefined";
      assert.equal(
        `${message.detail}`.replaceAll(" ", ""),
        expectedMessage.replaceAll(" ", "")
      );

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 5);
  });

  suite("Initialize State - Test Suite", () => {
    test("Initialize State works", async () => {
      setUp();
      await setUpWorkSpace();

      const extension = vscode.extensions.getExtension("Mega-T.branchman");
      if (extension && extension.isActive) {
        const context = extension.exports.context;

        var workspaceOneState = context.workspaceState.get(
          "workspace_one"
        ) as BranchState;
        var workspaceTwoState = context.workspaceState.get(
          "workspace_two"
        ) as BranchState;

        assert.ok(workspaceOneState && workspaceTwoState);
        assert.equal(workspaceOneState.currentBranch, "master");
        assert.equal(workspaceTwoState.currentBranch, "master");
      }

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT);
  });

  suite("Branch Listener - Test Suite", () => {
    test("Branch Listener works", async () => {
      setUp();
      await setUpWorkSpace();

      await TestUtility.delay(TestUtility.DELAY * 2);
      await TestUtility.checkoutBranch("workspace_one", "feat1");
      await TestUtility.delay(TestUtility.DELAY);

      assert.equal(infoMessageDialog.called, true);
      const message =
        infoMessageDialog.args[infoMessageDialog.args.length - 1][0];
      const expectedMessage =
        "Set branch master as the parent for the current branch feat1 ?";
      assert.equal(message, expectedMessage);

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 4);

    test("Branch Listener prompt works", async () => {
      setUp();
      await setUpWorkSpace();

      infoMessageDialog.resolves("Yes");

      await TestUtility.delay(TestUtility.DELAY * 2);
      await TestUtility.checkoutBranch("workspace_two", "feat2");
      await TestUtility.delay(TestUtility.DELAY);

      assert.equal(infoMessageDialog.called, true);
      const message =
        infoMessageDialog.args[infoMessageDialog.args.length - 1][0];
      const expectedMessage =
        "Set branch master as the parent for the current branch feat2 ?";
      assert.equal(message, expectedMessage);

      const extension = vscode.extensions.getExtension("Mega-T.branchman");
      if (extension && extension.isActive) {
        const context = extension.exports.context;
        var workspaceTwoState = context.workspaceState.get(
          "workspace_two"
        ) as BranchState;

        assert.equal(workspaceTwoState.parentBranch, "master");
      }

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 4);
  });

  suite("Update Branch State - Test Suite", () => {
    test("Update Branch State command works", async () => {
      setUp();
      await setUpWorkSpace();

      vscode.commands.executeCommand("branchman.set-branch-state");
      await TestUtility.delay(TestUtility.DELAY * 2);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 4);

    test("Update Branch State can update parent branch state", async () => {
      setUp();
      await setUpWorkSpace();

      quickPick.onCall(0).resolves("workspace_one");
      quickPick.onCall(1).resolves("Parent");
      quickPick.onCall(2).resolves("feat3");

      await TestUtility.delay(TestUtility.DELAY * 2);
      vscode.commands.executeCommand("branchman.set-branch-state");
      await TestUtility.delay(TestUtility.DELAY * 2);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );

      const extension = vscode.extensions.getExtension("Mega-T.branchman");
      if (extension && extension.isActive) {
        const context = extension.exports.context;
        var workspaceOneState = context.workspaceState.get(
          "workspace_one"
        ) as BranchState;

        assert.equal(workspaceOneState.parentBranch, "feat3");
      }

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 5);

    test("Update Branch State can update current branch state", async () => {
      setUp();
      await setUpWorkSpace();

      quickPick.onCall(0).resolves("workspace_one");
      quickPick.onCall(1).resolves("Current");
      quickPick.onCall(2).resolves("feat4");

      await TestUtility.delay(TestUtility.DELAY * 2);
      vscode.commands.executeCommand("branchman.set-branch-state");
      await TestUtility.delay(TestUtility.DELAY * 2);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );

      const extension = vscode.extensions.getExtension("Mega-T.branchman");
      if (extension && extension.isActive) {
        const context = extension.exports.context;
        var workspaceOneState = context.workspaceState.get(
          "workspace_one"
        ) as BranchState;

        assert.equal(workspaceOneState.currentBranch, "feat4");
      }

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 5);
  });

  suite("Update Child Branch - Test Suite", () => {
    test("Update Child Branch command works", async () => {
      setUp();
      await setUpWorkSpace();

      vscode.commands.executeCommand("branchman.update-child");
      await TestUtility.delay(TestUtility.DELAY);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 2);

    test("Update Child Branch show parent branch error message", async () => {
      setUp();
      await setUpWorkSpace();

      quickPick.resolves("workspace_one");

      vscode.commands.executeCommand("branchman.update-child");
      await TestUtility.delay(TestUtility.DELAY);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );
      assert.equal(errorMessageDialog.called, true);
      const errorMessage = errorMessageDialog.args[0][0];
      assert.equal(
        errorMessage,
        'No parent branch found for workspace_one, Set the branch state using the "Set Branch State" command.'
      );

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 2);

    test("Update Child Branch pull changes from parent branch", async () => {
      setUp();
      await setUpWorkSpace();

      quickPick.resolves("workspace_one");
      infoMessageDialog.resolves("Yes");

      await TestUtility.checkoutBranch("workspace_one", "feat3");
      await TestUtility.delay(TestUtility.DELAY * 2);

      vscode.commands.executeCommand("branchman.update-child");
      await TestUtility.delay(TestUtility.DELAY);
      assert.equal(quickPick.called, true);
      const message = quickPick.args[0][1];
      assert.equal(
        message.placeHolder,
        "Select a workspace folder to run git pull"
      );

      const pullMessage = infoMessageDialog.args[3][0];
      assert.equal(pullMessage, "Pull changes from master into feat3?");

      const gitMessage = infoMessageDialog.args[4][1];
      assert.equal(`${gitMessage.detail}`.includes("Already up to date"), true);

      tearDown();
    })?.timeout(TestUtility.TEST_TIMEOUT * 5);
  });
});
