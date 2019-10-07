import { Component, Vue } from "vue-property-decorator";
import Button from "@/components/button";
import { DialogManager } from "@/modules/dialog-manager";

export type ChooseMoveOptions = void;

export type ChooseMoveResult = string;

@Component({
  name: "ChooseMoveDialog"
})
export class ChooseMoveDialog extends Vue {
  render() {
    return (
      <div>
        Choose move!
        <Button onclick={() => DialogManager.accept()}>Close</Button>
      </div>
    );
  }
}
