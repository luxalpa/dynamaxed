import { ViewManager } from "@/modules/view-manager";
import { ProjectManager } from "@/modules/project-manager";
import deepmerge from "deepmerge";

export const store: any = {
  ViewManager,
  ProjectManager
};

const s = window.localStorage.getItem("state");
if (s) {
  const tree = JSON.parse(s);
  for (let cl in tree) {
    // noinspection JSUnfilteredForInLoop
    Object.assign(store[cl], tree[cl]);
  }
}

function persistStore() {
  window.localStorage.setItem("state", JSON.stringify(store));
}

for (let [o, k] of allProperties(store)) {
  const obj = Object.getOwnPropertyDescriptor(o, k)!;
  Object.defineProperty(o, k, {
    enumerable: true,
    configurable: true,
    set(v: any): void {
      obj.value = v;
      persistStore();
    },
    get(): any {
      return obj.value;
    }
  });
}

function* allProperties(obj: any): Generator<[any, any]> {
  if (typeof obj === "object") {
    for (let p in obj) {
      yield [obj, p];
      yield* allProperties(obj[p]);
    }
  }
}
