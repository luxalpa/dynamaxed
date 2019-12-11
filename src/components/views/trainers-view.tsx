import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { TrainerList } from "@/components/lists/trainer-list";
import { EditTrainerView } from "@/components/views/edit-trainer-view";

@Component({
  name: "TrainersView"
})
class TrainersViewCmp extends Vue {
  render() {
    return (
      <TrainerList
        onentryclick={(e: string) => ViewManager.push(EditTrainerView, e)}
      />
    );
  }
}

export const TrainersView: ViewProps<void> = {
  component: TrainersViewCmp,
  title: () => "All Trainers"
};

ViewManager.registerView(TrainersView, "trainers");
