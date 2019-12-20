import { ipcRenderer } from "electron";
import { Prop, Vue } from "vue-property-decorator";
import { addToStore } from "@/store";

export abstract class View<T> extends Vue {
  @Prop() args!: T;
}

interface ViewInstance<T> {
  name: string;
  params: T;
}

const NoView: ViewInstance<void> = {
  name: "",
  params: void 0
};

let registeredViews = new Map<string, new () => View<any>>();
let view2name = new Map<new () => View<any>, string>();

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
  viewStack: ViewInstance<unknown>[] = [];

  isView<T>(
    view: new () => View<T>,
    instance: ViewInstance<any>
  ): instance is ViewInstance<T> {
    return instance.name === view2name.get(view);
  }

  registerView(view: new () => View<any>, name: string) {
    registeredViews.set(name, view);
    view2name.set(view, name);
  }

  registerViews(views: Record<string, new () => View<any>>) {
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

  push<T>(view: new () => View<void>): void;
  push<T>(view: new () => View<T>, params: T): void;
  push<T>(view: new () => View<T>, params?: T): void {
    const name = view2name.get(view);
    if (!name) {
      throw new Error("View not registered!");
    }

    const currentView = {
      name,
      params
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

addToStore("view-manager", ViewManager);
Vue.observable(ViewManager);
