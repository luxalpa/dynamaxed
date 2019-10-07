import { Component, Vue } from "vue-property-decorator";
import { ProjectManager } from "@/modules/project-manager";
import Button from "@/components/button";
import { GameModel } from "@/model/model";

@Component({
  name: "Toolbar"
})
export default class Toolbar extends Vue {
  render() {
    return (
      <div id="toolbar">
        <div>[Project Name]</div>
        <Button onclick={() => GameModel.Save()}>Save</Button>
        <Button onclick={() => ProjectManager.closeProject()}>
          Close Project
        </Button>
      </div>
    );
  }
}
