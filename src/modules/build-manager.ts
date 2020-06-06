import { ChildProcess, spawn } from "child_process";
import { Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import { Registry } from "@/registry";
import { remote } from "electron";
import path from "path";

export namespace BuildManager {
  export enum BuildResult {
    Unknown,
    Failed,
    Success
  }

  async function runCommand(cmd: string) {
    return new Promise<number>((resolve, reject) => {
      const cwd = remote.process.env.PORTABLE_EXECUTABLE_DIR || ".";

      let bashPath = path.join(cwd, "msys64\\usr\\bin\\bash.exe");
      if (process.env.NODE_ENV !== "production") {
        bashPath = "dist_electron/" + bashPath;
      }

      console.log(cwd);

      BuildState.lines = [];

      const projectPath = ProjectManager.currentProjectPath.replace(
        /\\/g,
        "\\\\\\\\"
      );

      const emitter = spawn(
        bashPath,
        [
          "-l",
          "-c",
          `cd ${projectPath} && ${cmd} CC1:=/opt/agbcc/bin/agbcc LIBPATH:="-L /opt/agbcc/lib"`
        ],
        {
          cwd
        }
      );

      emitter.stdout.on("data", data => {
        BuildState.lines.push(data.toString());
      });

      emitter.stderr.on("data", data => {
        BuildState.lines.push(data.toString());
      });

      emitter.on("error", err => console.error(err));
      emitter.on("close", code => resolve(code));
    });
  }

  export async function make(command: string = "") {
    if (BuildState.runProcess !== null) {
      BuildState.runProcess.kill();
    }

    BuildState.isBuilding = true;
    const code = await runCommand("make -j$(nproc) " + command);
    BuildState.result = code == 0 ? BuildResult.Success : BuildResult.Failed;
    BuildState.lastErrorCode = code;
    BuildState.isBuilding = false;
  }

  export async function runOnEmulator() {
    BuildState.runProcess = spawn("cmd", [
      "/C",
      path.join(ProjectManager.currentProjectPath, "pokeemerald.gba")
    ]);
  }

  export const BuildState = Vue.observable({
    lines: [] as string[],
    result: BuildResult.Unknown,
    lastErrorCode: -1,
    isBuilding: false,
    runProcess: null as ChildProcess | null
  });
}
