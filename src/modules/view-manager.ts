export interface ViewProps<Params> {
  component: any;
  title: (p: Params) => string;
}

interface ViewInstance {
  name: string;
  params: any;
}

const NoView: ViewInstance = {
  name: "",
  params: ""
};

let registeredViews = new Map<string, ViewProps<any>>();
let view2name = new Map<ViewProps<any>, string>();

export const ViewManager = new (class {
  viewStack: ViewInstance[] = [];

  registerView(view: ViewProps<any>, name: string) {
    registeredViews.set(name, view);
    view2name.set(view, name);
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

  push<T>(view: ViewProps<void>): void;
  push<T>(view: ViewProps<T>, params: T): void;
  push<T>(view: ViewProps<T>, params?: T): void {
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

  get activeTitle(): string {
    return this.activeView.title(this.currentView.params);
  }

  get hasUndo(): boolean {
    return this.viewStack.length > 1;
  }
})();
