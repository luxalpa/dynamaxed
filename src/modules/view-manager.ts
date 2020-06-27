import { ipcRenderer } from "electron";
import { Prop, PropSync, Vue } from "vue-property-decorator";
import { makePersistent } from "@/store";

export abstract class View<T, U = void> extends Vue {
  @Prop() args!: T;
  @PropSync("syncedState") state!: U;
}

interface ViewInstance<T, U> {
  name: string;
  params: T;
  state: U;
}

const NoView: ViewInstance<void, void> = {
  name: "",
  params: void 0,
  state: void 0
};

let registeredViews = new Map<string, new () => View<any>>();
let view2name = new Map<new () => View<any, any>, string>();

// Currently broken (https://github.com/electron/electron/issues/17134)
ipcRenderer.on("app-command", (e, cmd: string) => {
  console.log("Backwards!");
});

window.addEventListener("mousedown", event => {
  switch (event.button) {
    case 3:
      ViewManager.pop();
    // case 4: history.forward(); break;
  }
});

export const ViewManager = new (class {
  viewStack: ViewInstance<unknown, unknown>[] = [];

  isView<T, U>(
    view: new () => View<T, U>,
    instance: ViewInstance<any, any>
  ): instance is ViewInstance<T, U> {
    return instance.name === view2name.get(view);
  }

  registerView(view: new () => View<any>, name: string) {
    registeredViews.set(name, view);
    view2name.set(view, name);
  }

  registerViews(views: Record<string, new () => View<any, any>>) {
    for (const [name, cmp] of Object.entries(views)) {
      this.registerView(cmp, name);
    }
  }

  cleanupStack() {
    // Limits the history size to X entries.
    const historySize = 10;

    const numAbove = this.viewStack.length - historySize;

    if (numAbove > 0) {
      this.viewStack.splice(0, numAbove);
    }
  }

  pop() {
    if (this.viewStack.length > 1) {
      this.viewStack.pop();
    }
  }

  push<T, U = void>(view: new () => View<void, U>): void;
  push<T, U = void>(view: new () => View<T, U>, params: T): void;
  push<T, U = void>(view: new () => View<T, U>, params?: T): void {
    const name = view2name.get(view);
    if (!name) {
      throw new Error(`View not registered!`);
    }

    const currentView = {
      name,
      params,
      state: null
    };

    this.viewStack.push(currentView);
  }

  get currentView() {
    if (this.viewStack.length == 0) {
      return NoView;
    }

    return this.viewStack[this.viewStack.length - 1];
  }

  get activeView() {
    const view = registeredViews.get(this.currentView.name);
    if (!view) {
      throw new Error("Couldn't find view");
    }
    return view;
  }

  get hasUndo(): boolean {
    return this.viewStack.length > 1;
  }
})();

makePersistent("view-manager", ViewManager);
Vue.observable(ViewManager);
