import fs from "fs";
import http from "http";
import lzma from "lzma-native";
import tar from "tar";
import rimraf from "rimraf";
import { spawn } from "child_process";
import { exec as sudo } from "sudo-prompt";
import util from "util";

// TODO: Currently not working well, fix at some point. Also better to do the entire thing in a huge batch script instead of using javascript.

async function sudoExec(command: string) {
  return new Promise((resolve, reject) => {
    sudo(command, { name: "exec" }, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function cleanup() {
  await sudoExec("src/build-tools/cleanup.bat");
}

async function downloadMsys() {
  const decompressor = lzma.createDecompressor();

  await new Promise((resolve, reject) => {
    const response = http.get(
      "http://repo.msys2.org/distrib/x86_64/msys2-base-x86_64-20190524.tar.xz",
      function(response) {
        response.pipe(decompressor).pipe(
          tar.x({
            cwd: "dist_electron"
          })
        );
      }
    );

    response.on("close", () => {
      resolve();
    });

    response.on("error", err => reject(err));
  });
}

async function runBashCmd(command: string) {
  return new Promise((resolve, reject) => {
    const emitter = spawn(`./dist_electron/msys64/usr/bin/bash.exe`, [
      "-l",
      "-c",
      command
    ]);

    emitter.stdout.on("data", message => console.log(message.toString()));

    emitter.on("message", message => console.log(message));
    emitter.on("close", code => resolve(code));
    emitter.on("error", err => reject(err));
  });
}

async function initMsys2() {
  await runBashCmd("pacman --help");
}

async function run() {
  await cleanup();
  console.log("Downloading MSYS2...");
  await downloadMsys();
  console.log("Initializing MSYS2...");
  await initMsys2();
}

run()
  .then(() => {
    console.log("done");
  })
  .catch(reason => console.log(reason));
