import { ProjectManager } from "@/modules/project-manager";
import { GameModel } from "@/model/model";
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
      </v-app-bar>
    );
  }
});
