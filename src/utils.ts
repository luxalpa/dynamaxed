// Events for native event handlers
import { GameModel } from "@/model/model";
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

  for (const m of mon.moves) {
    if (m.level > lvl) {
      break;
    }
    moves.push(m.move);
  }
  if (moves.length < 4) {
    return extendArray(moves, 4, "NONE");
  }
  return moves.slice(-4);
}

export function generateUniqueID(
  base: string,
  model: Record<string, unknown>
): string {
  let idPrefix = base + "_";

  let usedNums: number[] = [];

  for (let key of Object.keys(model)) {
    if (key.startsWith(idPrefix)) {
      const res = key.substr(idPrefix.length).match(/^\d+$/);
      if (!res || res.length == 0) {
        continue;
      }
      const num = parseInt(res[0][0]);
      usedNums.push(num);
    }
  }

  usedNums.sort((a, b) => a - b);

  let curNum = 1;

  while (true) {
    if (usedNums[curNum - 1] === curNum) {
      curNum++;
      continue;
    }
    break;
  }

  return `${base}_${curNum}`;
}

export function createModelObj<T>(
  model: Record<string, T>,
  defaultObj?: () => T
): string {
  const newObj = defaultObj ? defaultObj() : { ...model["NONE"] };

  let newID = generateUniqueID("CUSTOM", model);

  Vue.set(model, newID, newObj);
  return newID;
}
