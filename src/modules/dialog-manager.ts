import { Component } from "vue";
import {
  EditTrainerDialog,
  EditTrainerOptions,
  EditTrainerResult
} from "@/views/dialogs/edit-trainer-dialog";
import {
  ChooseMoveDialog,
  ChooseMoveOptions,
  ChooseMoveResult
} from "@/views/dialogs/choose-move-dialog";

interface ActiveDialog {
  resolve(params?: any): void;
  reject(result?: any): void;
  component: Component;
  params: any;
}

export const DialogManager = new (class {
  dialogs: ActiveDialog[] = [];

  accept<T>(params?: T) {
    const d = this.dialogs.pop();
    if (!d) {
      throw new Error("No Dialogs to close!");
    }
    d.resolve(params);
  }

  reject() {
    const d = this.dialogs.pop();
    if (!d) {
      throw new Error("No Dialogs to close!");
    }
    d.reject();
  }

  async openDialog(
    component: typeof EditTrainerDialog,
    params: EditTrainerOptions
  ): Promise<EditTrainerResult>;
  async openDialog(
    component: typeof ChooseMoveDialog,
    params: ChooseMoveOptions
  ): Promise<ChooseMoveResult>;
  async openDialog(component: any, params: any) {
    return new Promise<any>((resolve, reject) => {
      this.dialogs.push({
        component,
        params,
        reject,
        resolve
      });
    });
  }
})();
