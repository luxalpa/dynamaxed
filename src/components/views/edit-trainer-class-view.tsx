import { Component } from "vue-property-decorator";
import { View } from "@/modules/view-manager";
import { FlexRow, Window, WindowLayout } from "@/components/layout";
import { Spacer } from "@/components/spacer";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { GameModel, TrainerClass } from "@/model/model";

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

  render() {
    return (
      <WindowLayout>
        <Window>
          <FlexRow>
            <Label width={3}>Title</Label>
            <Button>{this.trainerClass.name}</Button>
          </FlexRow>

          <FlexRow>
            <Label width={3}>Money</Label>
            <Button>{this.trainerClass.money}</Button>
          </FlexRow>
        </Window>
      </WindowLayout>
    );
  }
}
