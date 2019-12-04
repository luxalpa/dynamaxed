import { ViewManager } from "@/modules/view-manager";
import { ProjectManager } from "@/modules/project-manager";
import { SelectionManager } from "@/modules/selection-manager";
import { TrainersView } from "@/views/trainers-view";
import { EditTrainerView } from "@/views/edit-trainer-view";

export const store: any = {
  ViewManager,
  ProjectManager
};

if (process.env.NODE_ENV !== "development") {
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
} else {
  // Dev stuff
  ProjectManager.openProject(
    "C:\\Users\\Smaug\\Desktop\\Pokemon\\pokeemerald\\"
  );
  ViewManager.push(EditTrainerView, "GABRIELLE_1");
  // DialogManager.openDialog(
  //   EditTrainerMonDialog,
  //   GameModel.model.trainers["SAWYER_1"].party[0]
  // );
}

export function persistStore() {
  window.localStorage.setItem("state", JSON.stringify(store));
}

// for (let [o, k] of allProperties(store)) {
//   const obj = Object.getOwnPropertyDescriptor(o, k)!;
//   Object.defineProperty(o, k, {
//     enumerable: true,
//     configurable: true,
//     set(v: any): void {
//       obj.value = v;
//       persistStore();
//     },
//     get(): any {
//       return obj.value;
//     }
//   });
// }
//
// function* allProperties(obj: any): Generator<[any, any]> {
//   if (typeof obj === "object") {
//     for (let p in obj) {
//       yield [obj, p];
//       yield* allProperties(obj[p]);
//     }
//   }
// }
