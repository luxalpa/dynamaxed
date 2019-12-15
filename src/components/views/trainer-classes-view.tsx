import { Component } from "vue-property-decorator";
import { View, ViewManager } from "@/modules/view-manager";
import { TrainerClassList } from "@/components/lists/trainer-class-list";
import { EditTrainerClassView } from "@/components/views/edit-trainer-class-view";

@Component
export class TrainerClassesView extends View<void> {
  get title(): string {
    return "All Trainer Classes";
  }

  render() {
    return (
      <TrainerClassList
        onentryclick={(id: string) =>
          ViewManager.push(EditTrainerClassView, id)
        }
      />
    );
  }
}
