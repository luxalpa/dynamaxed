import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";

export interface IRecentProject {
  name: string;
  path: string;
}

@Module({ name: "project-manager", dynamic: true, store })
class ProjectManagerModule extends VuexModule {
  recentProjects: Array<IRecentProject> = [
    {
      name: "Some Recent Project",
      path: "/dev/null"
    }
  ];
}

export const ProjectManager = getModule(ProjectManagerModule);
