import { Component, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel, TrainerClass } from "@/model/model";
import { Dialog, DialogManager } from "@/modules/dialog-manager";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { IDManager } from "@/modules/id-manager";
import { Portal } from "portal-vue";

@Component
export class EditTrainerClassView extends View<string> {
  get title(): string {
    return `Trainer Class ${this.classID}`;
  }

  get classID(): string {
    return this.args;
  }

  get trainerClass(): TrainerClass {
    return GameModel.model.trainerClasses[this.classID];
  }

  async changeTitle() {
    const title = await DialogManager.openDialog(
      InputTextDialog,
      this.trainerClass.name
    );
    if (title !== undefined) {
      this.trainerClass.name = title;
    }
  }

  async changeMoney() {
    const money = await DialogManager.openDialog(
      InputTextDialog,
      this.trainerClass.money ? this.trainerClass.money.toString() : ""
    );
    if (money !== undefined) {
      if (money == "") {
        Vue.delete(this.trainerClass, "money");
      } else {
        Vue.set(this.trainerClass, "money", parseInt(money));
      }
    }
  }

  async changeID() {
    const id = await DialogManager.openDialog(InputTextDialog, this.classID);
    if (id !== undefined) {
      IDManager.changeTrainerClassID(this.classID, id);
    }
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">{this.title}</Portal>
        <Window>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button onclick={() => this.changeID()}>#{this.classID}</Button>
          </FlexRow>

          <FlexRow>
            <Label width={3}>Title</Label>
            <Button onclick={() => this.changeTitle()}>
              {this.trainerClass.name}
            </Button>
          </FlexRow>

          <FlexRow>
            <Label width={3}>Money</Label>
            <Button onclick={() => this.changeMoney()}>
              {this.trainerClass.money}
            </Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
