import { GameModel } from "@/model/model";
import { ViewManager } from "@/modules/view-manager";
import { Vue } from "vue-property-decorator";

export namespace IDManager {
  export function changeTrainerID(oldID: string, newID: string) {
    if (oldID === newID) {
      return;
    }
    const trainer = GameModel.model.trainers[oldID];
    Vue.set(GameModel.model.trainers, newID, trainer);

    for (let viewInstance of ViewManager.viewStack) {
      if (
        viewInstance.name === "edit-trainer" &&
        viewInstance.params === oldID
      ) {
        viewInstance.params = newID;
      }
    }
  }
}
