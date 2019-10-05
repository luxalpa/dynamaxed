import { remote } from "electron";
import { Dialog, ViewManager } from "@/modules/view-manager";

export interface IRecentProject {
  name: string;
  path: string;
}

export interface IProjectInfo {
  name: string;
  path: string;
}

const NoProject: IProjectInfo = {
  name: "<No Project>",
  path: "<No Path>"
};

export const ProjectManager = new (class {
  currentProject: IProjectInfo = NoProject;
  counter = [0, 0, 1];

  recentProjects: Array<IRecentProject> = [
    {
      name: "Some Recent Project",
      path: "/dev/null"
    }
  ];

  async importProject() {
    const { filePaths } = await remote.dialog.showOpenDialog({
      title: "Select folder",
      properties: ["openDirectory"]
    });
    if (!filePaths || filePaths.length == 0) {
      return;
    }
    ViewManager.openDialog(Dialog.ImportProject);
  }
})();
