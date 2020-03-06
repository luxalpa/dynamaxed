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
import { ListDialog } from "@/components/lists/list";
import { List } from "@/constants";
import { chooseNumber, chooseText } from "@/components/views/utils";

@Component
export class EditTrainerClassView extends View<string> {
  get classID(): string {
    return this.args;
  }

  get trainerClass(): TrainerClass {
    return GameModel.model.trainerClasses[this.classID];
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
      const replaceID = await DialogManager.openDialogWithLabel(
        `Select another TrainerClass to replace all usages of this one`,
        ListDialog,
        {
          list: List.TrainerClass,
          key: ""
        }
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
    const trainerClass = this.trainerClass;

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
            <Button onclick={() => chooseText(trainerClass, "name", 13)}>
              {trainerClass.name}
            </Button>
          </FlexRow>

          <FlexRow>
            <Label width={3}>Money</Label>
            <Button onclick={() => chooseNumber(trainerClass, "money", 255)}>
              {trainerClass.money}
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
