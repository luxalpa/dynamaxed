import { Component, Vue } from "vue-property-decorator";
import Button from "@/components/button";
import { ViewManager } from "@/modules/view-manager";

@Component({
  name: "ImportDialog"
})
export default class ImportDialog extends Vue {
  render() {
    return (
      <div>
        This is a dialog.{" "}
        <Button onclick={() => ViewManager.closeDialog()}>Close</Button>
      </div>
    );
  }
}
