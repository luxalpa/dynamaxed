import { Component, Vue } from "vue-property-decorator";
import { SelectionManager, SelectionType } from "@/modules/selection-manager";
import { InspectorTrainer } from "@/components/inspector/inspector-trainer";

@Component
export class InspectorPanel extends Vue {
  render() {
    switch (SelectionManager.selection.type) {
      case SelectionType.Trainer: {
        return <InspectorTrainer />;
      }
      default: {
        return <div>Nothing</div>;
      }
    }
  }
}
