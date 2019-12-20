import { GameModel } from "@/model/model";
import { ViewManager } from "@/modules/view-manager";
import { Vue } from "vue-property-decorator";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";
import { EditTrainerView } from "@/components/views/edit-trainer-view";

export namespace IDManager {
  export function changeTrainerID(oldID: string, newID: string) {
    if (oldID === newID) {
      return;
    }
    const trainer = GameModel.model.trainers[oldID];
    Vue.delete(GameModel.model.trainers, oldID);
    Vue.set(GameModel.model.trainers, newID, trainer);

    for (let viewInstance of ViewManager.viewStack) {
      if (
        ViewManager.isView(EditTrainerView, viewInstance) &&
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
    Vue.delete(GameModel.model.trainerClasses, oldID);
    Vue.set(GameModel.model.trainerClasses, newID, trainerClass);

    for (let trainer of Object.values(GameModel.model.trainers)) {
      if (trainer.trainerClass === oldID) {
        trainer.trainerClass = newID;
      }
    }

    for (let viewInstance of ViewManager.viewStack) {
      if (
        ViewManager.isView(EditTrainerClassView, viewInstance) &&
        viewInstance.params === oldID
      ) {
        viewInstance.params = newID;
      }
    }
  }

  export function removeTrainerClass(id: string, replacement: string) {
    Vue.delete(GameModel.model.trainerClasses, id);
    for (let i = 0; i < ViewManager.viewStack.length; i++) {
      const view = ViewManager.viewStack[i];
      if (
        ViewManager.isView(EditTrainerClassView, view) &&
        view.params === id
      ) {
        Vue.delete(ViewManager.viewStack, i);
      }
    }

    for (let trainer of Object.values(GameModel.model.trainers)) {
      if (trainer.trainerClass === id) {
        trainer.trainerClass = replacement;
      }
    }
  }

  export function removeTrainer(id: string, replacement: string = "NONE") {
    Vue.delete(GameModel.model.trainers, id);
    for (let i = 0; i < ViewManager.viewStack.length; i++) {
      const view = ViewManager.viewStack[i];
      if (ViewManager.isView(EditTrainerView, view) && view.params === id) {
        Vue.delete(ViewManager.viewStack, i);
      }
    }
  }
}
