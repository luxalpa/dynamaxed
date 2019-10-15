import Button from "@/components/button";
import { DialogManager, DialogOptions } from "@/modules/dialog-manager";
import { componentFactory } from "vue-tsx-support";

type ChooseMoveOptions = void;

type ChooseMoveResult = string;

const ChooseMoveDialogCmp = componentFactory.create({
  render() {
    return (
      <div>
        Choose move!
        <Button onclick={() => DialogManager.accept()}>Close</Button>
      </div>
    );
  }
});

export const ChooseMoveDialog: DialogOptions<undefined, ChooseMoveResult> = {
  component: ChooseMoveDialogCmp,
  maxWidth: 500
};
