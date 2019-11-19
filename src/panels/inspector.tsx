import { Component, Vue } from "vue-property-decorator";
import { SelectionManager } from "@/modules/selection-manager";

@Component
export class InspectorPanel extends Vue {
  render() {
    switch (SelectionManager.selection.type) {
      case "trainer": {
        return <div>Trainer</div>;
      }
      default: {
        return <div>Nothing</div>;
      }
    }
  }
}
