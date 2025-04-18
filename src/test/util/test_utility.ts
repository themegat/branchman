import { exec } from "child_process";
import path from "path";
import * as vscode from "vscode";

export class TestUtility {
  static readonly TEST_TIMEOUT = 4000;
  static readonly DELAY = 2000;
  public static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static async checkoutBranch(
    workspaceName: string,
    branchName: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const workspace = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "src",
        "test",
        "env",
        workspaceName
      );

      process.chdir(workspace);

      const command = ` git checkout ${branchName}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        } else if (stderr) {
          resolve(`Stderr: ${stderr}`);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  public static get extensionContext(): vscode.ExtensionContext {
    const extension = vscode.extensions.getExtension("Mega-T.branchman");
    if (extension && extension.isActive) {
      const context = extension.exports.context;
      return context;
    } else {
      throw new Error("Extension is not active");
    }
  }
}
