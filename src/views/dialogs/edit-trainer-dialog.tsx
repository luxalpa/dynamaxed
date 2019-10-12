import { Component, Vue } from "vue-property-decorator";
import { EditTrainerOptions, ViewManager } from "@/modules/view-manager";
import { GameModel, NoTrainer, Trainer } from "@/model/model";
import { HTMLElementEvent } from "@/utils";
import Button from "@/components/button";
import { DialogManager } from "@/modules/dialog-manager";
import cloneDeep from "lodash.clonedeep";
import { ChooseMoveDialog } from "@/views/dialogs/choose-move-dialog";
import { componentFactory } from "vue-tsx-support";

export interface EditTrainerOptions {
  trainerId: string;
}

export interface EditTrainerResult {
  trainerId: string;
}

export const EditTrainerDialog = componentFactory.create({
  props: {
    params: {}
  },

  data() {
    return {
      trainer: NoTrainer,
      oldTrainerID: "",
      trainerID: ""
    };
  },

  methods: {
    accept() {
      if (this.oldTrainerID !== this.trainerID) {
        delete GameModel.model.trainers[this.oldTrainerID];
      }
      GameModel.model.trainers[this.trainerID] = this.trainer;
      DialogManager.accept();
    }
  },

  created() {
    const options: EditTrainerOptions = this.$props.params;
    this.trainer = cloneDeep(GameModel.model.trainers[options.trainerId]);
    this.trainerID = options.trainerId;
    this.oldTrainerID = options.trainerId;
  },

  render() {
    return (
      <div>
        <table>
          <tr>
            <td>ID</td>
            <td>
              <input value={this.trainerID} />
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
              <input
                value={this.trainer.trainerName}
                oninput={(event: HTMLElementEvent<HTMLInputElement>) => {
                  this.trainer.trainerName = event.target.value;
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Class</td>
            <td>{this.trainer.trainerClass}</td>
          </tr>
          <tr>
            <td>Picture</td>
            <td>{this.trainer.trainerPic}</td>
          </tr>
        </table>
        <Button
          onclick={() =>
            DialogManager.openDialog(ChooseMoveDialog).catch(() => {})
          }
        >
          Select Move
        </Button>
        <Button onclick={() => this.accept()}>OK</Button>
        <Button onclick={() => DialogManager.reject()}>Cancel</Button>
      </div>
    );
  }
});
