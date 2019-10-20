export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
};

export function extendArray<T>(arr: Array<T>, len: number, value: T): Array<T> {
  const oldLen = arr.length;
  if (oldLen >= len) {
    return arr;
  }
  arr.length = len;
  arr.fill(value, oldLen);
  return arr;
}
