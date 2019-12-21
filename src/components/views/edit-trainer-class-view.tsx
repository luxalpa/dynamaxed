import { Component, Vue } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel, TrainerClass } from "@/model/model";
import { DialogManager } from "@/modules/dialog-manager";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { IDManager } from "@/modules/id-manager";
import { Portal } from "portal-vue";
import { IDDisplay } from "@/components/displays/id-display";

@Component
export class EditTrainerClassView extends View<string> {
  get classID(): string {
    return this.args;
  }

  get trainerClass(): TrainerClass {
    return GameModel.model.trainerClasses[this.classID];
  }

  async changeTitle() {
    const title = await DialogManager.openDialog(InputTextDialog, {
      value: this.trainerClass.name
    });
    if (title !== undefined) {
      this.trainerClass.name = title;
    }
  }

  async changeMoney() {
    const money = await DialogManager.openDialog(InputTextDialog, {
      value: this.trainerClass.money ? this.trainerClass.money.toString() : ""
    });
    if (money !== undefined) {
      if (money == "") {
        Vue.delete(this.trainerClass, "money");
      } else {
        Vue.set(this.trainerClass, "money", parseInt(money));
      }
    }
  }

  async changeID() {
    const id = await DialogManager.openDialog(InputTextDialog, {
      value: this.classID,
      check: v => {
        if (v === this.classID) {
          return false;
        }
        if (Object.keys(GameModel.model.trainerClasses).some(k => k === v)) {
          return "Trainer class already exists!";
        }
        return false;
      }
    });
    if (id !== undefined) {
      IDManager.changeTrainerClassID(this.classID, id);
    }
  }

  async deleteTrainerClass() {
    let id = "";
    if (
      Object.values(GameModel.model.trainers).some(
        t => t.trainerClass === this.classID
      )
    ) {
      // We must lazy load this to avoid import cycle -_-
      const { ChooseTrainerClassDialog } = await import(
        "@/components/lists/trainer-class-list"
      );

      const replaceID = await DialogManager.openDialogWithLabel(
        `Select another TrainerClass to replace all usages of this one`,
        ChooseTrainerClassDialog,
        ""
      );
      if (!replaceID) {
        return;
      }
      id = replaceID;
    }
    if (id !== this.classID) {
      IDManager.removeTrainerClass(this.classID, id);
    }
  }

  render() {
    return (
      <WindowLayout>
        <Portal to="title">
          Trainer Class <IDDisplay value={this.classID} />
        </Portal>
        <Window>
          <FlexRow>
            <Label width={3}>ID</Label>
            <Button onclick={() => this.changeID()}>
              <IDDisplay value={this.classID} />
            </Button>
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
          <FlexRow />
          <FlexRow>
            <Spacer width={2} />
            <Button width={4} onclick={() => this.deleteTrainerClass()}>
              Delete
            </Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
