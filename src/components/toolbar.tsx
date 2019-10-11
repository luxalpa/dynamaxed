import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";
import { FontAwesomeIcon } from "@/utils";

@Component({
  name: "Toolbar"
})
export default class Toolbar extends Vue {
  render() {
    return (
      <div id="toolbar">
        <div class="toolbar-btn" onclick={() => GameModel.Save()}>
          <span class="toolbar-icon">
            <FontAwesomeIcon icon={["far", "save"]} />
          </span>
          <span class="toolbar-text">Save</span>
        </div>
        <div id="toolbar-container-right">
          <div
            class="toolbar-btn"
            onclick={() => ProjectManager.closeProject()}
          >
            <span class="toolbar-icon">
              <FontAwesomeIcon icon={["fas", "times"]} />
            </span>
            <span class="toolbar-text">Close Project</span>
          </div>
        </div>
      </div>
    );
  }
}
