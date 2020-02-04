import { Prop, Vue } from "vue-property-decorator";
import { List } from "@/constants";
import { ListDialog } from "@/components/lists/list";

export class Dialog<T, U> extends Vue {
  @Prop() args!: T;
  @Prop() dialogID!: number;

  accept(this: Dialog<T, void>): void;
  accept(this: Dialog<T, U>, returnValue: U): void;
  accept(returnValue?: U): void {
    DialogManager.accept(this.dialogID, returnValue);
  }

  reject() {
    DialogManager.reject(this.dialogID);
  }
}

interface ActiveDialog {
  resolve(params?: any): void;
  reject(result?: any): void;
  params: any;
  id: number;
  component: new () => Dialog<any, any>;
  label: string;
}

export const DialogManager = new (class {
  private _autoIncDialogID = 0;
  dialogs: ActiveDialog[] = [];

  accept<T>(id: number, params?: T) {
    this.closeDialog(id).resolve(params);
  }

  closeDialog(id: number): ActiveDialog {
    const idx = this.dialogs.findIndex(d => d.id === id);
    if (idx == -1) {
      throw new Error("Dialog not found");
    }
    return this.dialogs.splice(idx, 1)[0];
  }

  closeTopmostDialog(): ActiveDialog {
    if (this.dialogs.length === 0) {
      throw new Error("No Dialogs to close!");
    }

    return this.closeDialog(this.dialogs[this.dialogs.length - 1].id);
  }

  reject(id: number) {
    this.closeDialog(id).resolve(undefined);
  }

  async openListDialog(list: List, key: string = "") {
    return this.openDialog(ListDialog, {
      list,
      key
    });
  }

  async openDialog<T, U>(
    dialog: new () => Dialog<void, U>
  ): Promise<U | undefined>;
  async openDialog<T, U>(
    dialog: new () => Dialog<T, U>,
    params: T
  ): Promise<U | undefined>;
  async openDialog<T, U>(
    dialog: new () => Dialog<T, U>,
    params?: T
  ): Promise<U | undefined> {
    return this.openDialogWithLabel("", dialog, params);
  }

  async openDialogWithLabel<T, U>(
    label: string,
    dialog: new () => Dialog<void, U>
  ): Promise<U | undefined>;
  async openDialogWithLabel<T, U>(
    label: string,
    dialog: new () => Dialog<T, U>,
    params: T
  ): Promise<U | undefined>;
  async openDialogWithLabel<T, U>(
    label: string,
    dialog: new () => Dialog<T, U>,
    params?: T
  ): Promise<U | undefined> {
    return new Promise<any>((resolve, reject) => {
      let d: ActiveDialog = {
        params,
        reject,
        resolve,
        component: dialog,
        id: this._autoIncDialogID++,
        label
      };

      this.dialogs.push(d);
    });
  }
})();

Vue.observable(DialogManager);
