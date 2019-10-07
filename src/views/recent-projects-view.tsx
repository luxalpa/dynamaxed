import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import Button from "@/components/button";

@Component({
  name: "RecentProjectsView"
})
export default class RecentProjectsView extends Vue {
  render() {
    return (
      <div id="recentProjects">
        {ProjectManager.recentProjects.map(project => (
          <Button
            class="importbtn-wrapper"
            onClick={() => ProjectManager.openProject(project.path)}
          >
            <div class="importbtn">
              <div class="importbtn-name">{project.name}</div>
              <div class="importbtn-path">{project.path}</div>
              <div class="importbtn-close">
                <div
                  class="importbtn-close-text"
                  onclick={(event: Event) => {
                    event.stopPropagation();
                    ProjectManager.removeRecentProject(project);
                  }}
                >
                  ✕
                </div>
              </div>
            </div>
          </Button>
        ))}
        <Button
          class="importbtn-wrapper"
          onClick={() => ProjectManager.importProject()}
        >
          Import Project
        </Button>
      </div>
    );
  }
}
