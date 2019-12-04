import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";

@Component({
  name: "ProjectSettingsView"
})
class ProjectSettingsViewCmp extends Vue {
  render() {
    return <div>Project Settings</div>;
  }
}

export const ProjectSettingsView: ViewProps<void> = {
  component: ProjectSettingsViewCmp,
  title: () => "Project Settings"
};

ViewManager.registerView(ProjectSettingsView, "project-settings");
