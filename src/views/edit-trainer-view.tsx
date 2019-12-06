import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { GameModel } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Theme } from "@/theming";
import { TextInput } from "@/components/text-input";
import { ChooseInput } from "@/components/choose-input";

@Component
class EditTrainerViewCmp extends Vue {
  get trainer() {
    return GameModel.model.trainers[this.trainerID];
  }

  get trainerID() {
    return ViewManager.activeParams as string;
  }

  render() {
    return (
      <div>
        <div class={styles.trainerPicRow}>
          <ChooseInput>
            <img
              class={styles.trainerPic}
              src={PathManager.trainerPic(this.trainer.trainerPic)}
            />
          </ChooseInput>
          <div>
            <TextInput vModel={this.trainer.trainerName} />
            <TextInput value={this.trainerID} disabled />
          </div>
        </div>
      </div>
    );
  }
}

export const EditTrainerView: ViewProps<string> = {
  component: EditTrainerViewCmp,
  title: trainerId => `Trainer #${trainerId}`
};

ViewManager.registerView(EditTrainerView, "edit-trainer");

const styles = stylesheet({
  trainerPic: {
    margin: "10px",
    width: "64px",
    height: "64px",
    backgroundColor: Theme.middlegroundBgColor,
    padding: "5px"
  },
  trainerPicRow: {
    display: "flex"
  }
});
