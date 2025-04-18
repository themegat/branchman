import { exec } from "child_process";
import { console } from "inspector";
import path from "path";

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
    const { findUp } = await import("find-up");

    const packageJsonPath = await findUp("package.json");

    if (!packageJsonPath) {
      throw new Error("package.json not found!");
    }

    const rootDir = path.dirname(packageJsonPath);
    const githubWorkDir = process.cwd();
    console.log("githubWorkDir", githubWorkDir);

    const workspace = path.join(githubWorkDir, "src", "test", "env", workspaceName);
    return new Promise((resolve, reject) => {
      const command = `cd ${workspace} && git checkout ${branchName}`;
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
}
