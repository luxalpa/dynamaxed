interface ActiveDialog {
  resolve(params?: any): void;
  reject(result?: any): void;
  dialogOpts: DialogOptions<any, any>;
  params: any;
  vmodel: boolean;
  id: number;
}

export interface DialogOptions<Params, ReturnType> {
  maxWidth?: number;
  component: any;
  modal?: boolean;
}

export const DialogManager = new (class {
  private _autoIncDialogID = 0;
  dialogs: ActiveDialog[] = [];

  accept<T>(params?: T) {
    this.closeTopmostDialog().resolve(params);
  }

  private closeTopmostDialog(): ActiveDialog {
    if (this.dialogs.length === 0) {
      throw new Error("No Dialogs to close!");
    }

    const d = this.dialogs[this.dialogs.length - 1];
    d.vmodel = false;
    setTimeout(() => {
      let idx = this.dialogs.indexOf(d);
      this.dialogs.splice(idx, 1);
    }, 500);
    return d;
  }

  reject() {
    this.closeTopmostDialog().resolve(undefined);
  }

  async openDialog<T, U>(
    dialogOpts: DialogOptions<T, U>,
    params: T
  ): Promise<U | undefined> {
    return new Promise<any>((resolve, reject) => {
      let d: ActiveDialog = {
        dialogOpts,
        params,
        reject,
        resolve,
        vmodel: false,
        id: this._autoIncDialogID++
      };

      setTimeout(() => {
        d.vmodel = true;
      }, 1);

      this.dialogs.push(d);
    });
  }
})();
