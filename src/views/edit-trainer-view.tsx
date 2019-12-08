import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { GameModel } from "@/model/model";
import { stylesheet } from "typestyle";
import { PathManager } from "@/modules/path-manager";
import { Theme } from "@/theming";
import { TextInput } from "@/components/text-input";
import { ChooseButton } from "@/components/choose-button";
import { EditorProperty } from "@/components/editor-property";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { TrainerClass } from "@/components/trainer-class";
import { Checkbox } from "@/components/checkbox";

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
        <ChooseButton width={3} height={3}>
          <img
            class={styles.trainerPic}
            src={PathManager.trainerPic(this.trainer.trainerPic)}
          />
        </ChooseButton>
        <div class={styles.flex}>
          <Label width={3}>Name:</Label>
          <Button>{this.trainer.trainerName}</Button>
        </div>
        <div class={styles.flex}>
          <Label width={3}>ID:</Label>
          <Button>#{this.trainerID}</Button>
        </div>
        <div class={styles.flex}>
          <Label width={3}>Trainer Class:</Label>
          <Button height={2}>
            <TrainerClass classId={this.trainer.trainerClass} />
          </Button>
        </div>
        <div class={styles.flex}>
          <Label width={4}>Encounter Music:</Label>
          <Button width={4}>{this.trainer.encounterMusic}</Button>
        </div>
        <div class={styles.centered}>
          <Checkbox vModel={this.trainer.doubleBattle}>Double Battle</Checkbox>
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
    width: "64px",
    height: "64px"
  },
  flex: {
    display: "flex"
  },
  centered: {
    display: "flex",
    justifyContent: "center"
  }
});
