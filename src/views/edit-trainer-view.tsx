import { Component, Vue } from "vue-property-decorator";
import { ViewManager, ViewProps } from "@/modules/view-manager";

@Component
class EditTrainerViewCmp extends Vue {
  render() {
    return <div>Edit Trainer View</div>;
  }
}

export const EditTrainerView: ViewProps<string> = {
  component: EditTrainerViewCmp,
  title: trainerId => `Trainer #${trainerId}`
};

ViewManager.registerView(EditTrainerView, "edit-trainer");
