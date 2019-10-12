interface ActiveDialog {
  resolve(params?: any): void;
  reject(result?: any): void;
  dialogOpts: DialogOptions<any, any>;
  params: any;
}

export interface DialogOptions<T, U> {
  maxWidth?: number;
  component: any;
  paramsType: T;
  returnType: U;
}

export function Dialog<T, U>(opt: DialogOptions<T, U>): DialogOptions<T, U> {
  return {
    maxWidth: opt.maxWidth,
    component: opt.component
  } as DialogOptions<T, U>;
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

  async openDialog<T, U>(
    dialogOpts: DialogOptions<T, U>,
    params?: T
  ): Promise<U> {
    return new Promise<any>((resolve, reject) => {
      this.dialogs.push({
        dialogOpts,
        params,
        reject,
        resolve
      });
    });
  }
})();
