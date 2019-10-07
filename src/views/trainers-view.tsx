import { Component, Vue } from "vue-property-decorator";
import { GameModel, Trainer } from "@/model/model";
import { Dialog, ViewManager } from "@/modules/view-manager";
import { DialogManager } from "@/modules/dialog-manager";
import { EditTrainerDialog } from "@/views/dialogs/edit-trainer-dialog";

@Component({
  name: "TrainersView"
})
export default class TrainersView extends Vue {
  render() {
    const trainerList: [string, Trainer][] = Object.keys(
      GameModel.model.trainers
    ).map(t => [t, GameModel.model.trainers[t]]);
    return (
      <div id="trainer-table">
        {trainerList.map(([name, trainer]) => (
          <div
            class="trainer-edit"
            onclick={() => {
              DialogManager.openDialog(EditTrainerDialog, {
                trainerId: name
              }).catch(() => {});
            }}
          >
            <div class="trainer-id">{name}</div>
            <div class="trainer-name">{trainer.trainerName}</div>
          </div>
        ))}
      </div>
    );
  }
}
