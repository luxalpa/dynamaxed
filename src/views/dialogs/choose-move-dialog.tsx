import { Component, Vue } from "vue-property-decorator";
import Button from "@/components/button";
import { Dialog, DialogManager, DialogOptions } from "@/modules/dialog-manager";
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

export const ChooseMoveDialog = Dialog({
  component: ChooseMoveDialogCmp,
  maxWidth: 500,
  returnType: (undefined as unknown) as ChooseMoveResult,
  paramsType: undefined
});
