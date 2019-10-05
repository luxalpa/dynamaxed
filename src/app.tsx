import { Component, Vue } from "vue-property-decorator";
import Button from "@/components/button";
import { ViewManager } from "@/modules/view-manager";
import { ProjectManager } from "@/modules/project-manager";
import { store } from "@/store";

@Component({
  name: "App"
})
export default class App extends Vue {
  store = store;

  render(h: any) {
    const CurrentDialog: any = ViewManager.currentDialog;
    return (
      <div id="app">
        <div id="recentProjects">
          {ProjectManager.recentProjects.map(project => (
            <Button
              class="importbtn-wrapper"
              onClick={() => console.log("Error")}
            >
              <div class="importbtn">
                <div class="importbtn-name">{project.name}</div>
                <div class="importbtn-path">{project.path}</div>
              </div>
            </Button>
          ))}
          <Button
            class="importbtn-wrapper"
            onClick={ProjectManager.importProject}
          >
            Import Project
          </Button>
        </div>
        {ViewManager.showDialog && (
          <div id="dialog">
            <div class="window">{<CurrentDialog />}</div>
          </div>
        )}

        {ViewManager.showFader && <div id="fader" />}
      </div>
    );
  }
}
