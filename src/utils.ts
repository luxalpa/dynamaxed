// Events for native event handlers
import { GameModel, Move } from "@/model/model";
import { Vue } from "vue-property-decorator";

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
};

// extends the array to the desired len and fills the new elements up with value
export function extendArray<T>(arr: Array<T>, len: number, value: T): Array<T> {
  const oldLen = arr.length;
  if (oldLen >= len) {
    return arr;
  }
  arr.length = len;
  arr.fill(value, oldLen);
  return arr;
}

export function clearSelection() {
  (window as any).getSelection().removeAllRanges();
}

export function getDefaultMovesForMon(species: string, lvl: number): string[] {
  const mon = GameModel.model.pokemon[species];

  // This assumes that the mon.moves array is sorted by level

  let moves: string[] = [];

  for (const [movLvl, id] of mon.moves) {
    if (movLvl > lvl) {
      break;
    }
    moves.push(id);
  }
  if (moves.length < 4) {
    return extendArray(moves, 4, "NONE");
  }
  return moves.slice(-4);
}

export function createModelObj<T>(
  model: Record<string, T>,
  defaultObj?: () => T
): string {
  const newObj = defaultObj ? defaultObj() : { ...model["NONE"] };

  let newID = "CUSTOM_1";

  Vue.set(model, newID, newObj);
  return newID;
}
