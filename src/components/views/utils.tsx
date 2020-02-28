import { List } from "@/constants";
import { DialogManager } from "@/modules/dialog-manager";
import { Vue } from "vue-property-decorator";
import { InputNumberDialog } from "@/components/dialogs/input-number-dialog";
import { InputTextDialog } from "@/components/dialogs/input-text-dialog";
import { createTextValidator } from "@/input-validators";

export async function chooseFromList<T extends Object>(
  obj: T,
  prop: keyof T & string,
  list: List
) {
  const x = obj[prop];
  if (typeof x !== "string") {
    throw new Error("Needs a string");
  }

  const v = await DialogManager.openListDialog(list, x);
  if (v !== undefined) {
    Vue.set(obj, prop, v);
  }
}

export async function chooseNumber<T extends Object>(
  obj: T,
  stat: keyof T & string,
  max: number = 255,
  min: number = 0
) {
  const originalValue = obj[stat];

  if (typeof originalValue !== "number") {
    throw new Error("Only works for numeric stats!");
  }

  const v = await DialogManager.openDialog(InputNumberDialog, {
    value: originalValue,
    min,
    max
  });
  if (v !== undefined) {
    Vue.set(obj, stat, v);
  }
}

export async function chooseText<T extends Object>(
  obj: T,
  prop: keyof T & string,
  maxLen: number
) {
  const x = obj[prop];
  if (typeof x !== "string") {
    throw new Error("Needs a string");
  }

  const text = await DialogManager.openDialog(InputTextDialog, {
    value: x,
    check: createTextValidator(maxLen)
  });

  if (text !== undefined) {
    Vue.set(obj, prop, text);
  }
}
