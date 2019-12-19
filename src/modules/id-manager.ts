import { GameModel } from "@/model/model";
import { ViewManager } from "@/modules/view-manager";
import { Vue } from "vue-property-decorator";
import { ViewID } from "@/constants";

export namespace IDManager {
  export function changeTrainerID(oldID: string, newID: string) {
    if (oldID === newID) {
      return;
    }
    const trainer = GameModel.model.trainers[oldID];
    delete GameModel.model.trainers[oldID];
    Vue.set(GameModel.model.trainers, newID, trainer);

    for (let viewInstance of ViewManager.viewStack) {
      if (
        viewInstance.name === ViewID.EditTrainer &&
        viewInstance.params === oldID
      ) {
        viewInstance.params = newID;
      }
    }
  }

  export function changeTrainerClassID(oldID: string, newID: string) {
    if (oldID === newID) {
      return;
    }
    const trainerClass = GameModel.model.trainerClasses[oldID];
    delete GameModel.model.trainerClasses[oldID];
    Vue.set(GameModel.model.trainerClasses, newID, trainerClass);

    for (let trainer of Object.values(GameModel.model.trainers)) {
      if (trainer.trainerClass === oldID) {
        trainer.trainerClass = newID;
      }
    }

    for (let viewInstance of ViewManager.viewStack) {
      if (
        viewInstance.name === ViewID.EditTrainerClass &&
        viewInstance.params === oldID
      ) {
        viewInstance.params = newID;
      }
    }
  }
}
