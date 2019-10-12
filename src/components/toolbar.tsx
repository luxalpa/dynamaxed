import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";
import { FontAwesomeIcon } from "@/utils";
import { componentFactory } from "vue-tsx-support";

export const Toolbar = componentFactory.create({
  name: "Toolbar",
  render() {
    return (
      <v-app-bar app dense clipped-left>
        <v-btn rounded text onclick={() => GameModel.Save()}>
          <v-icon left>far fa-save</v-icon>
          Save
        </v-btn>
        <v-spacer />
        <v-btn rounded text onclick={() => ProjectManager.closeProject()}>
          Close Project
          <v-icon right small>
            fas fa-times
          </v-icon>
        </v-btn>
        {/*<div class="toolbar-btn" onclick={() => GameModel.Save()}>*/}
        {/*  <span class="toolbar-icon">*/}
        {/*    <FontAwesomeIcon icon={["far", "save"]} />*/}
        {/*  </span>*/}
        {/*  <span class="toolbar-text">Save</span>*/}
        {/*</div>*/}
        {/*<div id="toolbar-container-right">*/}
        {/*  <div*/}
        {/*    class="toolbar-btn"*/}
        {/*    onclick={() => ProjectManager.closeProject()}*/}
        {/*  >*/}
        {/*    <span class="toolbar-icon">*/}
        {/*      <FontAwesomeIcon icon={["fas", "times"]} />*/}
        {/*    </span>*/}
        {/*    <span class="toolbar-text">Close Project</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </v-app-bar>
    );
  }
});
