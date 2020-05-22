import { exec } from "child_process";

export namespace Registry {
  let RegistryRE = /^\r\n.*?\r\n\s+(.*?)\s+(\w+)\s+(.*?)\r\n/m;

  export async function getDefaultKey(name: string) {
    return new Promise<string>((resolve, reject) => {
      exec(`reg query ${name} /ve`, (error, stdout, stderr) => {
        if (error) reject(error);
        // console.log(new Buffer(stdout));

        const result = RegistryRE.exec(stdout);
        if (!result) {
          reject("Incorrect Regex");
          return;
        }

        const [valueName, valueType, value] = result.slice(1);
        resolve(value);
      });
    });
  }
}
