import { SelectionType } from "@/modules/selection-manager";

export const AssetManagerState = new (class {
  currentEntry: SelectionType = SelectionType.Trainer;
})();
