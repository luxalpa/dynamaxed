import { ProjectManager } from "@/modules/project-manager";

let store: any = {};

export function restoreState() {
  const s = window.localStorage.getItem("state");
  if (s) {
    const tree = JSON.parse(s);
    for (let cl in tree) {
      try {
        // noinspection JSUnfilteredForInLoop
        Object.assign(store[cl], tree[cl]);
      } catch (e) {
        console.error(e);
      }
    }

    // The model isn't part of the state, so we must get it separately.
    if (ProjectManager.enableEditing) {
      ProjectManager.loadProject();
    }
  }
}

export function persistState() {
  window.localStorage.setItem("state", JSON.stringify(store));
}

export function makePersistent(name: string, obj: any) {
  store[name] = obj;
}
