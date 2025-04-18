import { exec } from "child_process";
import path from "path";

export class TestUtility {
  static readonly TEST_TIMEOUT = 4000;
  static readonly DELAY = 2000;
  public static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static checkoutBranch(
    workspaceName: string,
    branchName: string
  ): Promise<string> {
    const dir = process.cwd();
    const workspace = path.join(dir, "..", "..", "src", "test", "env", workspaceName);
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
