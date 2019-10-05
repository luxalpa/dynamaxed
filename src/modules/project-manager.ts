import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { store } from "@/store";
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

function getProjectInfo(path: string): IProjectInfo | undefined {
  return;
}

@Module({ name: "project-manager", dynamic: true, store })
class ProjectManagerModule extends VuexModule {
  currentProject: IProjectInfo = NoProject;

  recentProjects: Array<IRecentProject> = [
    {
      name: "Some Recent Project",
      path: "/dev/null"
    }
  ];

  @Action
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
}

export const ProjectManager = getModule(ProjectManagerModule);
