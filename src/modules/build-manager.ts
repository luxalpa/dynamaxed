import fs from "fs";
import http from "http";
import { spawn } from "child_process";
import { Vue } from "vue-property-decorator";
import { BuildLogDialog } from "@/components/dialogs/build-log-dialog";
import { DialogManager } from "@/modules/dialog-manager";

export namespace BuildManager {
  export async function build() {
    let bashPath = "msys64/usr/bin/bash.exe";
    if (process.env.NODE_ENV !== "production") {
      bashPath = "dist_electron/" + bashPath;
    }

    DialogManager.openDialog(BuildLogDialog);
    BuildLog.lines = [];

    const emitter = spawn(bashPath, [
      "-l",
      "-c",
      `cd c:/projects/dynamaxed-emerald && make -j$(nproc)`
    ]);
    emitter.stdout.on("data", data => {
      BuildLog.lines.push(data.toString());
    });
    emitter.stderr.on("data", data => {
      BuildLog.lines.push(data.toString());
    });

    emitter.on("error", err => console.error(err));
  }

  export const BuildLog = Vue.observable({
    lines: [] as string[]
  });
}
