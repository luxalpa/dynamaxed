import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";
import { TrainerList } from "@/components/lists/trainer-list";

@Component({
  name: "TrainersView"
})
class TrainersViewCmp extends Vue {
  render() {
    return <TrainerList />;
  }
}

export const TrainersView: ViewProps<void> = {
  component: TrainersViewCmp,
  title: () => "All Trainers"
};

ViewManager.registerView(TrainersView, "trainers");
