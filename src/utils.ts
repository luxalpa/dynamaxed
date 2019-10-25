// Events for native event handlers
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

// ignores the result in a Promise.catch()
export const CATCH_IGNORE = () => {};
