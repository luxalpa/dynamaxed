import { View, ViewManager } from "@/modules/view-manager";
import { ProjectManager } from "@/modules/project-manager";
import { DialogManager } from "@/modules/dialog-manager";
import { EditTrainerDialog } from "@/views/dialogs/edit-trainer-dialog";
import { EditFlagsDialog } from "@/views/dialogs/edit-flags-dialog";
import { EditTrainerMonDialog } from "@/views/dialogs/edit-trainer-mon-dialog";
import { GameModel } from "@/model/model";
import { SelectionManager } from "@/modules/selection-manager";

export const store: any = {
  ViewManager,
  ProjectManager,
  SelectionManager
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
  ViewManager.setActiveView(View.trainers);
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
