import ImportDialog from "@/views/import-dialog";

export const enum Dialog {
  None,
  ImportProject
}

export const ViewManager = new (class {
  _currentDialog: Dialog = Dialog.None;

  get currentDialog() {
    switch (this._currentDialog) {
      case Dialog.None:
        return undefined;
      case Dialog.ImportProject:
        return ImportDialog;
    }
  }

  get showDialog(): boolean {
    return this._currentDialog !== Dialog.None;
  }

  get showFader(): boolean {
    return this._currentDialog !== Dialog.None;
  }

  openDialog(dialog: Dialog) {
    this._currentDialog = dialog;
  }

  closeDialog() {
    this._currentDialog = Dialog.None;
  }
})();
