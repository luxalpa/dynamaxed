import { Component } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { TrainerList } from "@/components/lists/trainer-list";
import { EditTrainerView } from "@/components/views/edit-trainer-view";

@Component({
  name: "TrainersView"
})
export class TrainersView extends View<void> {
  get title(): string {
    return "All Trainers";
  }

  render() {
    return (
      <TrainerList
        onentryclick={(e: string) => ViewManager.push(EditTrainerView, e)}
      />
    );
  }
}
