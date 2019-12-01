import ProjectSettingsView from "@/views/project-settings-view";
import { TrainersView } from "@/views/trainers-view";

export enum View {
  project,
  trainers,
  trainerClasses
}

interface ViewSettings {
  component: any;
  title: string;
}

const views: Record<View, ViewSettings> = {
  [View.project]: {
    component: ProjectSettingsView,
    title: "Project Settings"
  },
  [View.trainers]: {
    component: TrainersView,
    title: "Trainers"
  },
  [View.trainerClasses]: {
    component: TrainersView,
    title: "Trainers"
  }
};

export const ViewManager = new (class {
  _activeView: View = View.project;

  setActiveView(view: View) {
    this._activeView = view;
  }

  get activeView() {
    return views[this._activeView].component;
  }

  get activeViewTitle() {
    return views[this._activeView].title;
  }
})();
