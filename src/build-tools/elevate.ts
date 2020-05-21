import sudo from "sudo-prompt";

sudo.exec(
  "ts-node --project src/build-tools/tsconfig.json src/build-tools/main.ts",
  {
    name: "Elevate"
  },
  (error, stdout, stderr) => {
    if (error) throw error;
    console.log(stdout);
  }
);
