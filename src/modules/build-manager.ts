import { ChildProcess, spawn } from "child_process";
import { Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import { Registry } from "@/registry";
import path from "path";

export namespace BuildManager {
  export enum BuildResult {
    Unknown,
    Failed,
    Success
  }

  async function runCommand(cmd: string) {
    return new Promise<number>((resolve, reject) => {
      let bashPath = "msys64/usr/bin/bash.exe";
      if (process.env.NODE_ENV !== "production") {
        bashPath = "dist_electron/" + bashPath;
      }

      BuildState.lines = [];

      const projectPath = ProjectManager.currentProjectPath.replace(
        /\\/g,
        "\\\\\\\\"
      );

      const emitter = spawn(bashPath, [
        "-l",
        "-c",
        `cd ${projectPath} && make -j$(nproc)`
      ]);

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

  export async function build() {
    if (BuildState.runProcess !== null) {
      BuildState.runProcess.kill();
    }

    BuildState.isBuilding = true;
    const code = await runCommand("make -j$(nproc)");
    BuildState.result = code == 0 ? BuildResult.Success : BuildResult.Failed;
    BuildState.lastErrorCode = code;
    BuildState.isBuilding = false;
  }

  export async function getDefaultEmulatorPath(): Promise<string> {
    try {
      let emulatorPath = await Registry.getDefaultKey(
        "HKEY_CLASSES_ROOT\\.gba\\shell\\open\\command"
      );

      if (emulatorPath.startsWith('"')) {
        const result = /^"([^"]+)"/.exec(emulatorPath);
        if (result) {
          emulatorPath = result[1];
        }
      }
      return emulatorPath;
    } catch (e) {
      return "";
    }
  }

  export async function runOnEmulator() {
    const emuPath = await getDefaultEmulatorPath();
    BuildState.runProcess = spawn(emuPath, [
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
