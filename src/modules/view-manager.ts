import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { store } from "@/store";
import ImportDialog from "@/views/import-dialog";
import { Component } from "vue";

export const enum Dialog {
  None,
  ImportProject
}

@Module({ name: "view-manager", dynamic: true, store })
class ViewManagerModule extends VuexModule {
  showDialog: boolean = false;
  showFader: boolean = false;
  private _currentDialog: Dialog = Dialog.None;

  get currentDialog(): Component | undefined {
    switch (this._currentDialog) {
      case Dialog.None:
        return undefined;
      case Dialog.ImportProject:
        return ImportDialog;
    }
  }

  @Mutation
  openDialog(dialog: Dialog) {
    this._currentDialog = dialog;
    this.showFader = true;
    this.showDialog = true;
  }

  @Mutation
  closeDialog() {
    this.showDialog = false;
    this.showFader = false;
    this._currentDialog = Dialog.None;
  }
}

export const ViewManager = getModule(ViewManagerModule);
