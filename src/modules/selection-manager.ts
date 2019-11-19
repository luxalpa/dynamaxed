export enum SelectionType {
  None = "",
  Trainer = "trainer",
  TrainerClass = "trainerClass",
  Pokemon = "pokemon",
  Move = "move"
}

export interface Selection {
  type: SelectionType;
  object: string;
}

export const NoSelection: Selection = { type: SelectionType.None, object: "" };

export const SelectionManager = new (class {
  selection: Selection = NoSelection;

  setSelection(type: SelectionType, object: string) {
    this.selection = {
      type,
      object
    };
  }

  isSelected(type: string, object: string): boolean {
    return this.selection.type === type && this.selection.object === object;
  }
})();
