import { remote } from "electron";
import { GameModel } from "@/model/model";
import fs from "fs";
import path from "path";

export interface IRecentProject {
  name: string;
  path: string;
}

export const META_DIR = ".project-mewtwo";

export const ProjectManager = new (class {
  currentProjectPath: string = "";
  get enableEditing(): boolean {
    return this.currentProjectPath !== "";
  }

  recentProjects: Array<IRecentProject> = [];

  openProject(path: string) {
    this.currentProjectPath = path;
    this.loadProject();
  }

  loadProject() {
    if (fs.existsSync(path.join(this.currentProjectPath, META_DIR))) {
      try {
        GameModel.Deserialize();
      } catch (e) {
        console.error(e);
        GameModel.createFromDefaults(); // TODO: Tell the user that things are missing and only recreate the missing stuff.
      }
    } else {
      GameModel.createFromDefaults();
    }
  }

  closeProject() {
    this.currentProjectPath = "";
  }

  removeRecentProject(project: IRecentProject) {
    this.recentProjects = this.recentProjects.filter(v => v !== project);
  }

  async importProject() {
    const { filePaths } = await remote.dialog.showOpenDialog({
      title: "Select folder",
      properties: ["openDirectory"]
    });
    if (!filePaths || filePaths.length == 0) {
      return;
    }

    this.openProject(filePaths[0]);
  }
})();
